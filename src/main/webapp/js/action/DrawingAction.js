/**
 *  그림판 관련 Action
 */

define(['jquery', 'GradientAction', 'Figure'],
    function ($, GradientAction, Figure) {
        var drawingAction = function () {
            var self = this;
            var fillOption = null;
            var shapeData;
            var lineData = [];
            var isMouseDown;
            var gradientAction;
            var selectedFigure = null;
            var tool;

            /**
             * 초기화
             * @param toolObj
             */
            this.init = function (toolObj) {
                gradientAction = new GradientAction();
                tool = toolObj;
            };

            /**
             * 툴 선택
             * @param event
             */
            this.selectTool = function (event) {
                tool.setCurrent(event.target.id.split('tool-')[1]);
                $("button[id^=tool-]").removeClass("active");
                $("#" + event.target.id).addClass("active");

                $('#default-penSize').hide();
                $('#brush-penSize').hide();
                $('#eraser-penSize').hide();
                $('#shape-penSize').hide();
                $('#brush-shape').hide();
                $('#shape-shape').hide();
                $('#paint-option').hide();
                $('#gradient-option').hide();
                $('#gradient-option-view').hide();
                $('#gradient-color-pallet').hide();

                self.deselectFigure();
                fillOption = null;
                tool.getContext().setLineDash([]);
                self.setCanvasCursor(tool.getCurrent());

                switch (tool.getCurrent()) {
                    case 'pencil' :
                        tool.getPen().setBrush('round');
                        tool.getPen().setSize($('#default-penSize').find('select').val());
                        $('#default-penSize').show();
                        break;
                    case 'brush' :
                        tool.getPen().setBrush($('#brush-shape').find('select').val());
                        tool.getPen().setSize($('#brush-penSize').find('select').val());
                        $('#brush-shape').show();
                        $('#brush-penSize').show();
                        break;
                    case 'shape' :
                        tool.getPen().setSize($('#shape-penSize').find('select').val());
                        $('#shape-shape').show();
                        $('#shape-penSize').show();
                        break;
                    case 'paint' :
                        $('#paint-option').show();
                        fillOption = $('#paint-option').find('select').val();
                        if (fillOption == 'gradient') {
                            $('#gradient-option').show();
                        }
                        break;
                }
            };

            /**
             * 선택 툴에 대한 커서 변경
             * @param selectTool
             */
            this.setCanvasCursor = function (selectTool) {
                var cursor;
                if (selectTool == 'pencil') {
                    cursor = 'url(/image/icon/cursor/pencil.cur) 4 12, auto';
                } else if (selectTool == 'brush') {
                    cursor = 'url(/image/icon/cursor/brush.cur) 4 12, auto';
                } else if (selectTool == 'eraser') {
                    cursor = 'url(/image/icon/eraser_ico.png) 4 12, auto';
                } else if (selectTool == 'shape') {
                    cursor = 'crosshair';
                } else if (selectTool == 'paint') {
                    cursor = 'url(/image/icon/paint_ico.png) 4 12, auto';
                } else if (selectTool == 'selectFigure') {
                    cursor = 'move';
                } else {
                    cursor = 'default';
                }

                $(tool.getCanvas()).css('cursor', cursor);
            };

            /**
             * 펜 사이즈 선택
             * @param event
             */
            this.selectPenSize = function (event) {
                tool.getPen().setSize($(event.target).val());
            };

            /**
             * 색상 선택
             * @param event
             */
            this.selectColor = function (event) {
                $(event.target).siblings('li').removeClass('on');
                $(event.target).addClass('on');
                tool.getPen().setColor($(event.target).css('background-color'));
            };

            /**
             * 브러쉬 모양 선택
             * @param event
             */
            this.selectBrush = function (event) {
                tool.getPen().setBrush($(event.target).val());
            };

            /**
             * 도형 모양 선택
             * @param event
             */
            this.selectShape = function (event) {
                tool.getPen().setShape($(event.target).val());
            };

            /**
             * 새로그리기
             */
            this.clearCanvas = function () {
                tool.setData([]);
                tool.getContext().clearRect(0, 0, $(tool.getCanvas()).width(), $(tool.getCanvas()).height());
                tool.getPen().setImageData(tool.getContext().getImageData(0, 0, tool.getCanvas().width, tool.getCanvas().height));
            };

            /**
             * 선 그리기 이벤트
             * @param event
             */
            this.drawLine = function (event, index, figure) {
                var oldPoint = {}, newPoint = {};
                var lineWidth, strokeStyle, lineCap;

                if (event != null) { //일반 라인 그리기
                    tool.getPen().setNewPoint(event);
                    newPoint.x = tool.getPen().getNewPoint().x;
                    newPoint.y = tool.getPen().getNewPoint().y;
                    oldPoint.x = tool.getPen().getOldPoint().x;
                    oldPoint.y = tool.getPen().getOldPoint().y;

                    lineWidth = tool.getPen().getSize();
                    strokeStyle = tool.getPen().getColor();
                    lineCap = tool.getPen().getBrush();
                } else { //그 외 - 두번째 인자에 Figure 객체(라인 타입) 전달
                    newPoint.x = figure.getData()[index].newPoint.x;
                    newPoint.y = figure.getData()[index].newPoint.y;
                    oldPoint.x = figure.getData()[index].oldPoint.x;
                    oldPoint.y = figure.getData()[index].oldPoint.y;

                    lineWidth = figure.getLineWidth();
                    strokeStyle = figure.getStrokeStyle();
                    lineCap = figure.getLineCap();
                }

                tool.getContext().lineWidth = lineWidth; //라인 굵기
                tool.getContext().strokeStyle = strokeStyle; //라인 색상
                tool.getContext().lineCap = lineCap; //끝 부분 모양 (round, square 가 있음)

                tool.getContext().beginPath();
                tool.getContext().setLineDash([]);
                tool.getContext().moveTo(oldPoint.x, oldPoint.y);
                tool.getContext().lineTo(newPoint.x, newPoint.y);
                tool.getContext().stroke();

                lineData.push({oldPoint: $.extend({}, oldPoint), newPoint: $.extend({}, newPoint)});

                if (event != null) {
                    tool.getPen().setOldPoint(null, newPoint);
                }
            };

            /**
             * 해당 개체 이전/이후 그림 개체 그리기 - (배열순)
             */
            this.drawFigureByOrder = function (drawOrder, index, isSaveState, isMoveFigure) {
                var data = tool.getData(),
                    start, end;

                if (drawOrder == 'prev') {
                    start = 0;
                    end = index;
                } else if (drawOrder == 'next') {
                    start = index + 1;
                    end = data.length;
                }

                for (var i = start; i < end; i++) {
                    if (data[i] != undefined) {
                        if (data[i].getType() == 'pencil' || data[i].getType() == 'brush') {
                            lineData = [];
                            for (var j = 0; j < data[i].getData().length; j++) {
                                self.drawLine(null, j, data[i]);
                            }
                        } else if (data[i].getType() == 'shape') {
                            self.drawShape(null, data[i], isSaveState, isMoveFigure);
                        }
                    }
                }
            };

            /**
             * 개체 그리기 - line 타입의 경우 event로 그릴때 호출해야 함.
             * @param figureType : line, shape
             * @param event
             * @param index : data 배열의 index
             * @param figure : 그림 객체
             * @param isSaveState : 데이터 임시 저장 상태
             */
            this.drawFigure = function (figureType, event, index, figure, isSaveState, isMoveFigure, lineDataIndex, isDrawPrev) {
                if (isDrawPrev || isDrawPrev == undefined) {
                    self.drawFigureByOrder('prev', index, false, true);
                }

                if (figureType == 'line') {
                    if (event == null) {
                        self.drawLine(null, lineDataIndex, figure);
                    }
                } else if (figureType == 'shape') {
                    if (event != null) {
                        self.drawShape(event);
                    } else {
                        self.drawShape(null, figure, isSaveState, isMoveFigure);
                    }
                }

                if (tool.getData().length > index) {
                    if (figureType == 'line') {
                        if (tool.getData()[index].getData().length - 1 == lineDataIndex) {
                            self.drawFigureByOrder('next', index, false, true);
                        }
                    } else {
                        self.drawFigureByOrder('next', index, false, true);
                    }
                }
            };

            /**
             * 도형 그리기 이벤트
             * @param event
             */
            this.drawShape = function (event, figure, isSaveState, isMoveFigure) {
                var shapeType, shapeSize, shapeFillStyle, gradientFillType, gradientColor, gradientPosition, gradientDegree;
                var newX, newY, oldX, oldY;
                var fillStyle, lineWidth, strokeStyle;

                if (event != null) { //일반 도형 그리기
                    shapeType = tool.getPen().getShape();
                    tool.getPen().setNewPoint(event);
                    newX = tool.getPen().getNewPoint().x, newY = tool.getPen().getNewPoint().y;
                    oldX = tool.getPen().getOldPoint().x, oldY = tool.getPen().getOldPoint().y;
                    shapeSize = newX - oldX < 0 ? (newX - oldX) * (-1) : (newX - oldX);
                    lineWidth = tool.getPen().getSize();
                    strokeStyle = tool.getPen().getColor();
                    fillStyle = '#ffffff';
                } else { //그 외 - 두번째 인자에 Figure 객체(도형 타입) 전달
                    var shape = figure;
                    shapeType = shape.getData().shapeType;
                    tool.getPen().setNewPoint(null, shape.getData().coordinate);
                    oldX = shape.getData().coordinate.x, oldY = shape.getData().coordinate.y;
                    shapeSize = shape.getData().shapeSize;
                    lineWidth = shape.getLineWidth();
                    strokeStyle = shape.getStrokeStyle();
                    if (tool.getPen().getColor() == undefined) {
                        tool.getPen().setColor($('.color-pallet').find('li.on').css('background-color'));
                    }

                    shapeFillStyle = isMoveFigure ? shape.getData().shapeFillStyle : fillOption;

                    if (!isMoveFigure && shapeFillStyle == 'single' && isSaveState) {
                        fillStyle = tool.getPen().getColor();
                    } else {
                        fillStyle = shape.getFillStyle();
                        if (shapeFillStyle == 'gradient') {
                            gradientFillType = shape.getData().gradientFillType;
                            gradientColor = shape.getData().gradientColor;
                            gradientPosition = shape.getData().gradientPosition;
                            gradientDegree = shape.getData().gradientDegree;

                            if (!isMoveFigure || gradientFillType == undefined) {
                                gradientFillType = gradientAction.getType();
                                shape.getData().gradientFillType = gradientFillType;
                            }
                            if (!isMoveFigure || gradientColor == undefined) {
                                gradientColor = [$($('.breakpoint')[0]).attr('gradient-color'), $($('.breakpoint')[1]).attr('gradient-color')];
                                shape.getData().gradientColor = gradientColor;
                            }
                            if (!isMoveFigure || gradientPosition == undefined) {
                                gradientPosition = [$($('.breakpoint')[0]).attr('gradient-position'), $($('.breakpoint')[1]).attr('gradient-position')];
                                shape.getData().gradientPosition = gradientPosition;
                            }
                            if (!isMoveFigure || gradientDegree == undefined) {
                                gradientDegree = gradientAction.getDegree();
                                shape.getData().gradientDegree = gradientDegree;
                            }
                            var gradientData = gradientAction.getTypeGradientData(shape.getData().coordinate, shapeSize, shape);
                            gradientAction.setGradientFillStyle(tool.getContext(), gradientData);
                            fillStyle = tool.getContext().fillStyle;
                        }
                    }
                }

                tool.getContext().beginPath();
                tool.getContext().setLineDash([]);
                tool.getContext().fillStyle = fillStyle; //채우기 색상
                tool.getContext().lineWidth = lineWidth; //라인 굵기
                tool.getContext().strokeStyle = strokeStyle; //라인 색상

                if (shapeType == 'circle') {
                    tool.getContext().arc(oldX, oldY, shapeSize, 0, 2 * Math.PI); //원 중심 좌표, 반지름 크기
                    tool.getContext().fill();
                } else if (shapeType == 'triangle') {
                    tool.getContext().moveTo(oldX, oldY - shapeSize);
                    tool.getContext().lineTo(oldX - shapeSize, oldY + shapeSize);
                    tool.getContext().lineTo(oldX + shapeSize, oldY + shapeSize);
                    tool.getContext().fill();
                } else if (shapeType == 'square') {
                    tool.getContext().strokeRect(oldX - shapeSize / 2, oldY - shapeSize / 2, shapeSize, shapeSize);
                    tool.getContext().fillRect(oldX - shapeSize / 2, oldY - shapeSize / 2, shapeSize, shapeSize);
                }

                tool.getContext().closePath();
                tool.getContext().stroke();

                if (isSaveState == undefined || isSaveState != undefined && isSaveState) {
                    //개체 임시저장 - 도형 개체
                    shapeData = new Figure();
                    shapeData.setType('shape');
                    shapeData.setData({
                        shapeType: shapeType,    //도형 타입
                        coordinate: {              //도형 좌표
                            x: oldX,
                            y: oldY
                        },
                        shapeSize: shapeSize,      //도형 크기
                        shapeFillStyle: shapeFillStyle,
                        gradientFillType: gradientFillType,
                        gradientColor: gradientColor,
                        gradientPosition: gradientPosition,
                        gradientDegree: gradientDegree
                    });
                    shapeData.setStrokeStyle(tool.getContext().strokeStyle);
                    shapeData.setLineWidth(tool.getContext().lineWidth);
                    shapeData.setFillStyle(tool.getContext().fillStyle == undefined ? null : tool.getContext().fillStyle);
                }
            };

            /**
             * 채우기 옵션 선택
             * @param event
             */
            this.selectFillOption = function (event) {
                var option = $('#paint-option').find('.dropdown-menu').find('li.selected > a').attr('data-tokens');
                fillOption = option;
                if (fillOption == 'single') {
                    $('#gradient-option').hide();
                } else if (fillOption == 'gradient') {
                    $('#gradient-option').show();
                    $('#gradient-option').find('button').on('click', function () {
                        $('#gradient-option-view').show();
                    });
                }
            };

            /**
             * 채우기 이벤트 - (도형)
             * @param event
             */
            this.fillColor = function (event) {
                //개체 선택
                self.selectFigure(event);
                var figure = selectedFigure.figure, index = selectedFigure.index;

                //개체선택 해제
                self.deselectFigure();

                if (selectedFigure != undefined) {
                    figure.getData().shapeFillStyle = fillOption;
                    if (fillOption == 'gradient') {
                        figure.getData().gradientFillType = gradientAction.getType();
                        var gradientData = gradientAction.getTypeGradientData(figure.getData().coordinate, figure.getData().shapeSize, figure);
                        gradientAction.setGradientFillStyle(tool.getContext(), gradientData);
                        figure.setFillStyle(tool.getContext().fillStyle);
                    }
                    self.drawFigure('shape', null, index, figure, true, false, null, true);

                    tool.getData()[index] = shapeData;
                    tool.getPen().setImageData(tool.getContext().getImageData(0, 0, tool.getCanvas().width, tool.getCanvas().height));
                }
            };

            /**
             * 선택된 개체 사각 영역 point 반환
             * @param data
             * @returns {{leftTop: {}, leftBottom: {}, rightTop: {}, rightBottom: {}}}
             */
            this.getSelectAreaPoint = function (data) {
                var leftTop = {}, leftBottom = {}, rightTop = {}, rightBottom = {};
                var minStartPoint = {}, maxEndPoint = {};
                var dataPoints = data.getData();
                minStartPoint.x = dataPoints[0].oldPoint.x, minStartPoint.y = dataPoints[0].oldPoint.y;
                maxEndPoint.x = dataPoints[0].oldPoint.x, maxEndPoint.y = dataPoints[0].oldPoint.y;

                for (var i = 0; i < dataPoints.length - 2; i++) {
                    if (dataPoints[i + 1].oldPoint.x < minStartPoint.x) {
                        minStartPoint.x = dataPoints[i + 1].oldPoint.x;
                    }
                    if (dataPoints[i + 1].oldPoint.y < minStartPoint.y) {
                        minStartPoint.y = dataPoints[i + 1].oldPoint.y;
                    }
                    if (maxEndPoint.x < dataPoints[i + 1].oldPoint.x) {
                        maxEndPoint.x = dataPoints[i + 1].oldPoint.x;
                    }
                    if (maxEndPoint.y < dataPoints[i + 1].oldPoint.y) {
                        maxEndPoint.y = dataPoints[i + 1].oldPoint.y;
                    }
                    if (i == dataPoints.length - 2) {
                        if (dataPoints[dataPoints.length - 2].newPoint.x < minStartPoint.x) {
                            minStartPoint.x = dataPoints[dataPoints.length - 2].newPoint.x;
                        } else if (maxEndPoint.x < dataPoints[dataPoints.length - 2].newPoint.x) {
                            maxEndPoint.x = dataPoints[dataPoints.length - 2].newPoint.x;
                        }

                        if (dataPoints[dataPoints.length - 2].newPoint.y < minStartPoint.y) {
                            minStartPoint.y = dataPoints[dataPoints.length - 2].newPoint.y;
                        } else if (maxEndPoint.y < dataPoints[dataPoints.length - 2].newPoint.y) {
                            maxEndPoint.y = dataPoints[dataPoints.length - 2].newPoint.y;
                        }
                    }
                }

                leftTop.x = minStartPoint.x - data.getLineWidth(), leftTop.y = minStartPoint.y - data.getLineWidth();
                leftBottom.x = minStartPoint.x - data.getLineWidth(), leftBottom.y = maxEndPoint.y + data.getLineWidth();
                rightTop.x = maxEndPoint.x + data.getLineWidth(), rightTop.y = minStartPoint.y - data.getLineWidth();
                rightBottom.x = maxEndPoint.x + data.getLineWidth(), rightBottom.y = maxEndPoint.y + data.getLineWidth();

                return {
                    leftTop: leftTop,
                    leftBottom: leftBottom,
                    rightTop: rightTop,
                    rightBottom: rightBottom
                };
            }


            /**
             * 개체 선택
             * @param event
             * @returns {*} : selectedFigure 객체 반환 (canvas 내 객체정보 배열의 index 정보 포함)
             */
            this.selectFigure = function (event, point) {
                if (event != null) {
                    tool.getPen().setNewPoint(event);
                } else {
                    tool.getPen().setNewPoint(null, point);
                }
                var x = tool.getPen().getNewPoint().x, y = tool.getPen().getNewPoint().y;
                var points = {}, leftTop = {}, leftBottom = {}, rightTop = {}, rightBottom = {};
                var inFigure = false;

                var dataArr = tool.getData().slice();
                //거꾸로 순회해서 if 문에서 먼저 인식된 도형 찾으면 종료
                $(dataArr.reverse()).each(function (index, data) {
                    if (data != undefined) {
                        if (data.getType() == 'pencil' || data.getType() == 'brush') {
                            points = self.getSelectAreaPoint(data);

                            leftTop = points.leftTop;
                            leftBottom = points.leftBottom;
                            rightTop = points.rightTop;
                            rightBottom = points.rightBottom;
                        } else if (data.getType() == 'shape') {
                            var shapeX = data.getData().coordinate.x, shapeY = data.getData().coordinate.y;
                            var shapeSize = data.getData().shapeType == 'square' ? data.getData().shapeSize / 2 + (data.getLineWidth() / 2 + 1) : data.getData().shapeSize + (data.getLineWidth() / 2 + 1);

                            leftTop.x = shapeX - shapeSize, leftTop.y = shapeY - shapeSize;
                            leftBottom.x = shapeX - shapeSize, leftBottom.y = shapeY + shapeSize;
                            rightTop.x = shapeX + shapeSize, rightTop.y = shapeY - shapeSize;
                            rightBottom.x = shapeX + shapeSize, rightBottom.y = shapeY + shapeSize;
                        }

                        //사각 프레임 영역으로 도형 인식
                        if (leftTop.x <= x && x <= rightTop.x
                            && leftTop.y <= y && y <= leftBottom.y) {
                            inFigure = true;

                            tool.getContext().beginPath();
                            tool.getContext().setLineDash([4, 3]);
                            tool.getContext().moveTo(leftTop.x, leftTop.y);
                            tool.getContext().lineTo(leftBottom.x, leftBottom.y);
                            tool.getContext().lineTo(rightBottom.x, rightBottom.y);
                            tool.getContext().lineTo(rightTop.x, rightTop.y);
                            tool.getContext().closePath();
                            tool.getContext().lineWidth = '1'; //라인 굵기
                            tool.getContext().strokeStyle = '#333333'; //라인 색상
                            tool.getContext().stroke();

                            selectedFigure = {
                                figure: data,
                                index: dataArr.length - 1 - index
                            };
                            return false;
                        }
                    }
                });

                if (!inFigure) {
                    //개체선택 해제
                    self.deselectFigure();
                }
            };

            /**
             * 선택된 개체 이동
             * @param event
             */
            this.moveSelectFigure = function (event) {
                tool.getPen().setNewPoint(event);
                var x = tool.getPen().getNewPoint().x, y = tool.getPen().getNewPoint().y;
                var figure, index;

                if (selectedFigure != null) {
                    figure = selectedFigure.figure;
                    index = selectedFigure.index;
                    tool.getContext().clearRect(0, 0, tool.getCanvas().width, tool.getCanvas().height);

                    if (figure.getType() == 'pencil' || figure.getType() == 'brush') {
                        var centerPoint = {}, addPoint = {}, movePointArr = [{oldPoint: {}, newPoint: {}}];
                        var points = self.getSelectAreaPoint(figure);

                        centerPoint.x = points.leftTop.x + (points.rightTop.x - points.leftTop.x) / 2;
                        centerPoint.y = points.leftTop.y + (points.leftBottom.y - points.leftTop.y) / 2;

                        addPoint.x = (x - centerPoint.x);
                        addPoint.y = (y - centerPoint.y);

                        for (var i = 0; i < figure.getData().length; i++) {
                            movePointArr[i] = {
                                newPoint: {
                                    x: figure.getData()[i].newPoint.x + addPoint.x,
                                    y: figure.getData()[i].newPoint.y + addPoint.y
                                },
                                oldPoint: {
                                    x: figure.getData()[i].oldPoint.x + addPoint.x,
                                    y: figure.getData()[i].oldPoint.y + addPoint.y
                                }
                            };
                        }

                        for (var i = 0; i < figure.getData().length; i++) {
                            isDrawPrev = false;
                            if (i == 0) {
                                isDrawPrev = true;
                            }
                            self.drawFigure('line', null, index, figure, null, null, i, isDrawPrev);
                        }

                        tool.getData()[index].setData(movePointArr);
                    } else if (figure.getType() == 'shape') {
                        figure.getData().coordinate.x = x;
                        figure.getData().coordinate.y = y;

                        if (figure.getData().shapeFillStyle == 'gradient') {
                            var gradientData = gradientAction.getTypeGradientData(figure.getData().coordinate, figure.getData().shapeSize, figure);
                            gradientAction.setGradientFillStyle(tool.getContext(), gradientData);
                            figure.setFillStyle(tool.getContext().fillStyle);
                        }

                        self.drawFigure('shape', null, index, figure, true, true, null, true);
                        tool.getData()[index] = shapeData;
                    }

                    tool.getPen().setImageData(tool.getContext().getImageData(0, 0, tool.getCanvas().width, tool.getCanvas().height));
                }
            };

            /**
             * 선택된 개체 삭제
             * @param event
             */
            self.deleteSelectFigure = function (event) {
                console.log(tool.getCurrent());
                if (tool.getCurrent() == 'selectFigure') {
                    if (selectedFigure != null) {

                        delete tool.getData()[selectedFigure.index];

                        tool.getContext().clearRect(0, 0, tool.getCanvas().width, tool.getCanvas().height);
                        self.drawFigureByOrder('prev', tool.getData().length, false);
                        tool.getPen().setImageData(tool.getContext().getImageData(0, 0, tool.getCanvas().width, tool.getCanvas().height));
                    }
                }
            };

            /**
             * 영역 선택 해제
             */
            this.deselectFigure = function () {
                if (tool.getPen().getImageData() != undefined) {
                    tool.getContext().clearRect(0, 0, tool.getCanvas().width, tool.getCanvas().height);
                    tool.getContext().putImageData(tool.getPen().getImageData(), 0, 0);
                }
            };

            /**
             * 캔바스 이벤트
             * @param event
             */
            this.onDrawingEvent = function (event) {
                if (event.type == 'mousedown') {
                    if (event.button == 0) { // 마우스 왼쪽 버튼
                        isMouseDown = true;
                        switch (tool.getCurrent()) {
                            case 'pencil' :
                            case 'brush' :
                            case 'eraser' :
                                lineData = [];
                            case 'shape' :
                                tool.getPen().setOldPoint(event);
                                tool.getPen().setImageData(tool.getContext().getImageData(0, 0, tool.getCanvas().width, tool.getCanvas().height));
                                break;
                            case 'paint' :
                                self.fillColor(event);
                                break;
                            case 'selectFigure' :
                                //개체선택 해제
                                self.deselectFigure();
                                selectedFigure = null;
                                self.selectFigure(event);
                                break;
                        }
                    }
                } else if (event.type == 'mouseup') {
                    isMouseDown = false;
                    if (tool.getCurrent() == 'pencil' || tool.getCurrent() == 'brush') {
                        //선 개체
                        var figure = new Figure();
                        figure.setType(tool.getCurrent());
                        figure.setData($.extend([], lineData));
                        figure.setStrokeStyle(tool.getContext().strokeStyle);
                        figure.setLineWidth(tool.getContext().lineWidth);
                        figure.setLineCap(tool.getContext().lineCap);
                        figure.setFillStyle(tool.getContext().fillStyle == undefined ? null : tool.getContext().fillStyle);

                        //개체 저장
                        tool.getData().push(figure);
                    } else if (tool.getCurrent() == 'shape') {
                        //개체 저장
                        tool.getData().push(shapeData);
                    }

                    if (tool.getCurrent() != 'selectFigure' && tool.getCurrent() != 'paint') {
                        tool.getPen().setImageData(tool.getContext().getImageData(0, 0, tool.getCanvas().width, tool.getCanvas().height));
                    }
                } else if (event.type == 'mouseover') {
                    isMouseDown = false;
                } else if (event.type == 'mousemove') {
                    if (isMouseDown) {
                        switch (tool.getCurrent()) {
                            case 'pencil' :
                            case 'brush' :
                                self.drawLine(event);
                                break;
                            case 'shape' :
                                tool.getContext().clearRect(0, 0, tool.getCanvas().width, tool.getCanvas().height);
                                self.drawFigure('shape', event, tool.getData().length);
                                break;
                            case 'selectFigure' :
                                self.moveSelectFigure(event);
                                break;
                        }
                    }
                }

            }
        };

        return drawingAction;
    });