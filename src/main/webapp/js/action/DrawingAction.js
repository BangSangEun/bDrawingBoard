/**
 *  그림판 관련 Action
 */

define(['jquery', 'GradientAction', 'Drawing'],
    function($, GradientAction, Drawing) {
        var drawingAction = function() {
            var self = this;
            var paintOption = null;
            var figureData;
            var lineData;
            var isMouseDown;
            var gradientAction;
            var selectDrawing = null;
            var tool;

            /**
             * 초기화
             * @param toolObj
             */
            this.init = function(toolObj) {
                gradientAction = new GradientAction();
                tool = toolObj;
            };

            /**
             * 툴 선택
             * @param event
             */
            this.toolSelect = function(event) {
                tool.setCurrent(event.target.id.split('tool-')[1]);
                $("button[id^=tool-]").removeClass("active");
                $("#" + event.target.id).addClass("active");

                $('#default-penSize').hide();
                $('#brush-penSize').hide();
                $('#eraser-penSize').hide();
                $('#figure-penSize').hide();
                $('#brush-shape').hide();
                $('#figure-shape').hide();
                $('#paint-option').hide();
                $('#gradient-option').hide();
                $('#gradient-option-view').hide();
                $('#gradient-color-pallet').hide();

                self.prevCanvasReturn();
                paintOption = null;
                tool.getContext().setLineDash([]);
                self.setCanvasCursor(tool.getCurrent());

                switch(tool.getCurrent()) {
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
                    case 'eraser' :
                        tool.getPen().setBrush('square');
                        tool.getPen().setSize($('#eraser-penSize').find('select').val());
                        $('#eraser-penSize').show();
                        break;
                    case 'figure' :
                        tool.getPen().setSize($('#figure-penSize').find('select').val());
                        $('#figure-shape').show();
                        $('#figure-penSize').show();
                        break;
                    case 'paint' :
                        $('#paint-option').show();
                        paintOption = $('#paint-option').find('select').val();
                        if(paintOption == 'gradient') {
                            $('#gradient-option').show();
                        }
                        break;
                }
            };

            /**
             * 선택 툴에 대한 커서 변경
             * @param selectTool
             */
            this.setCanvasCursor = function(selectTool) {
                var cursor;
                if(selectTool == 'pencil') {
                    cursor = 'url(/image/icon/cursor/pencil.cur) 4 12, auto';
                }else if(selectTool == 'brush') {
                    cursor = 'url(/image/icon/cursor/brush.cur) 4 12, auto';
                }else if(selectTool == 'eraser') {
                    cursor = 'url(/image/icon/eraser_ico.png) 4 12, auto';
                }else if(selectTool == 'figure') {
                    cursor = 'crosshair';
                }else if(selectTool == 'paint') {
                    cursor = 'url(/image/icon/paint_ico.png) 4 12, auto';
                }else if(selectTool == 'selectDrawing') {
                    cursor = 'move';
                }else {
                    cursor = 'default';
                }

                $(tool.getCanvas()).css('cursor', cursor);
            };

            /**
             * 펜 사이즈 선택
             * @param event
             */
            this.penSizeSelect = function(event) {
                tool.getPen().setSize($(event.target).val());
            };

            /**
             * 색상 선택
             * @param event
             */
            this.colorSelect = function(event) {
                $(event.target).siblings('li').removeClass('on');
                $(event.target).addClass('on');
                tool.getPen().setColor($(event.target).css('background-color'));
            };

            /**
             * 브러쉬 모양 선택
             * @param event
             */
            this.brushSelect = function(event) {
                tool.getPen().setBrush($(event.target).val());
            };

            /**
             * 도형 모양 선택
             * @param event
             */
            this.figureSelect = function(event) {
                tool.getPen().setFigure($(event.target).val());
            };

            /**
             * 새로그리기
             */
            this.cleaerCanvas = function () {
                tool.setData([]);
                tool.getContext().clearRect(0,0, $(tool.getCanvas()).width(), $(tool.getCanvas()).height());
                tool.getPen().setImageData(tool.getContext().getImageData(0,0,tool.getCanvas().width,tool.getCanvas().height));
            };

            /**
             * 지우기 이벤트
             * @param event
             */
            this.eraserEvent = function(event) {
                tool.getPen().setNewPoint(event);
                tool.getContext().clearRect(tool.getPen().getNewPoint().x, tool.getPen().getNewPoint().y, tool.getPen().getSize(), tool.getPen().getSize());
            };

            /**
             * 선 그리기 이벤트
             * @param event
             */
            this.drawLineEvent = function(event, index, drawing) {
                var oldPoint = {}, newPoint = {};
                var lineWidth, strokeStyle, lineCap;

                if(event != null) { //일반 라인 그리기
                    tool.getPen().setNewPoint(event);
                    newPoint.x = tool.getPen().getNewPoint().x;
                    newPoint.y = tool.getPen().getNewPoint().y;
                    oldPoint.x = tool.getPen().getOldPoint().x;
                    oldPoint.y = tool.getPen().getOldPoint().y;

                    lineWidth = tool.getPen().getSize();
                    strokeStyle = tool.getPen().getColor();
                    lineCap = tool.getPen().getBrush();
                }else { //그 외 - 두번째 인자에 Drawing 객체(라인 타입) 전달
                    newPoint.x = drawing.getData()[index].newPoint.x;
                    newPoint.y = drawing.getData()[index].newPoint.y;
                    oldPoint.x = drawing.getData()[index].oldPoint.x;
                    oldPoint.y = drawing.getData()[index].oldPoint.y;

                    lineWidth = drawing.getLineWidth();
                    strokeStyle = drawing.getStrokeStyle();
                    lineCap = drawing.getLineCap();
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

                if(event != null) {
                    tool.getPen().setOldPoint(null, newPoint);
                }
            };

            /**
             * 해당 개체 이전/이후 그림 개체 그리기 - (배열순)
             */
            this.drawOrderDrawing = function(drawOrder, index, isSaveState) {
                var data = tool.getData(),
                    start, end;

                if(drawOrder == 'prev') {
                    start = 0;
                    end = index;
                }else if(drawOrder == 'next') {
                    start = index + 1;
                    end = data.length;
                }

                for(var i=start; i<end; i++) {
                    if(data[i].getType() == 'pencil' || data[i].getType() == 'brush') {
                        lineData = [];
                        for(var j=0; j<data[i].getData().length; j++) {
                            self.drawLineEvent(null, j, data[i]);
                        }
                    }else if(data[i].getType() == 'figure') {
                        self.drawFigureEvent(null, data[i], isSaveState);
                    }
                }
            };

            /**
             * 개체 그리기 - line 타입의 경우 event로 그릴때 호출해야 함.
             * @param drawingType : line, figure
             * @param event
             * @param index : data 배열의 index
             * @param drawing : 그림 객체
             * @param isSaveState : 데이터 임시 저장 상태
             */
            this.drawDrawingObject = function(drawingType, event, index, drawing, isSaveState, lineDataIndex) {
                self.drawOrderDrawing('prev', index, false);

                if(drawingType == 'line') {
                    if(event == null) {
                        self.drawLineEvent(null, lineDataIndex, drawing);
                    }
                }else if(drawingType == 'figure') {
                    if(event != null) {
                        self.drawFigureEvent(event);
                    }else {
                        self.drawFigureEvent(null, drawing, isSaveState);
                    }
                }

                if(tool.getData().length > index) {
                    self.drawOrderDrawing('next', index, false);
                }
            };

            /**
             * 도형 그리기 이벤트
             * @param event
             */
            this.drawFigureEvent = function(event, drawing, isSaveState) {
                var figureType, figureSize;
                var newX, newY, oldX, oldY;
                var fillStyle, lineWidth, strokeStyle;

                if(event != null) { //일반 도형 그리기
                    figureType = tool.getPen().getFigure();
                    tool.getPen().setNewPoint(event);
                    newX = tool.getPen().getNewPoint().x, newY = tool.getPen().getNewPoint().y;
                    oldX = tool.getPen().getOldPoint().x, oldY = tool.getPen().getOldPoint().y;
                    figureSize = newX - oldX < 0 ? (newX - oldX) * (-1) : (newX - oldX);
                    lineWidth = tool.getPen().getSize();
                    strokeStyle = tool.getPen().getColor();
                    fillStyle = '#ffffff';
                }else { //그 외 - 두번째 인자에 Drawing 객체(도형 타입) 전달
                    var figure = drawing;
                    figureType = figure.getData().figureType;
                    tool.getPen().setNewPoint(null, figure.getData().coordinate);
                    oldX = figure.getData().coordinate.x, oldY = figure.getData().coordinate.y;
                    figureSize = figure.getData().figureSize;
                    lineWidth = figure.getLineWidth();
                    strokeStyle = figure.getStrokeStyle();
                    if(tool.getPen().getColor() == undefined) {
                        tool.getPen().setColor($('.color-pallet').find('li.on').css('background-color'));
                    }
                    fillStyle = paintOption == 'single' && isSaveState ? tool.getPen().getColor() : figure.getFillStyle();
                }

                tool.getContext().beginPath();
                tool.getContext().setLineDash([]);
                tool.getContext().fillStyle = fillStyle; //채우기 색상
                tool.getContext().lineWidth = lineWidth; //라인 굵기
                tool.getContext().strokeStyle = strokeStyle; //라인 색상

                if(figureType == 'circle') {
                    tool.getContext().arc(oldX, oldY, figureSize, 0, 2*Math.PI); //원 중심 좌표, 반지름 크기
                    tool.getContext().fill();
                }else if(figureType == 'triangle') {
                    tool.getContext().moveTo(oldX, oldY - figureSize);
                    tool.getContext().lineTo(oldX - figureSize, oldY + figureSize);
                    tool.getContext().lineTo(oldX + figureSize, oldY + figureSize);
                    tool.getContext().fill();
                }else if(figureType == 'square') {
                    tool.getContext().strokeRect(oldX - figureSize/2, oldY - figureSize/2, figureSize, figureSize);
                    tool.getContext().fillRect(oldX - figureSize/2, oldY - figureSize/2, figureSize, figureSize);
                }

                tool.getContext().closePath();
                tool.getContext().stroke();

                if(isSaveState == undefined || isSaveState != undefined && isSaveState) {
                    //개체 임시저장 - 도형 개체
                    figureData = new Drawing();
                    figureData.setType('figure');
                    figureData.setData({
                        figureType : figureType,    //도형 타입
                        coordinate : {              //도형 좌표
                            x: oldX,
                            y: oldY
                        },
                        figureSize: figureSize      //도형 크기
                    });
                    figureData.setStrokeStyle(tool.getContext().strokeStyle);
                    figureData.setLineWidth(tool.getContext().lineWidth);
                    figureData.setFillStyle(tool.getContext().fillStyle == undefined ? null : tool.getContext().fillStyle);
                    figureData.setImageData(tool.getPen().getImageData());
                }
            };

            /**
             * 채우기 옵션 선택
             * @param event
             */
            this.paintOptionSelect = function(event) {
                var option = $('#paint-option').find('.dropdown-menu').find('li.selected > a').attr('data-tokens');
                paintOption = option;
                if(paintOption == 'single') {
                    $('#gradient-option').hide();
                }else if(paintOption == 'gradient') {
                    $('#gradient-option').show();
                    $('#gradient-option').find('button').on('click', function() {
                        $('#gradient-option-view').show();
                    });
                }
            };

            /**
             * 채우기 이벤트 - (도형)
             * @param event
             */
            this.paintEvent = function(event) {
                //개체 선택
                self.selectDrawingEvent(event);
                var drawing = selectDrawing.drawing, index = selectDrawing.index;

                //개체선택 해제
                self.prevCanvasReturn();

                if(selectDrawing != undefined) {
                    if(paintOption == 'gradient') {
                        var gradientData = gradientAction.getTypeGradientData(drawing.getData().coordinate, drawing.getData().figureSize);
                        gradientAction.setGradientFillStyle(tool.getContext(), gradientData, drawing);
                        drawing.setFillStyle(tool.getContext().fillStyle);
                    }
                    self.drawDrawingObject('figure', null, index, drawing, true);

                    tool.getData()[index] = figureData;
                    tool.getPen().setImageData(tool.getContext().getImageData(0,0,tool.getCanvas().width,tool.getCanvas().height));
                }
            };

            /**
             * 선택된 개체 사각 영역 point 반환
             * @param data
             * @returns {{leftTop: {}, leftBottom: {}, rightTop: {}, rightBottom: {}}}
             */
            this.getSelectAreaPoint = function(data) {
                var leftTop = {}, leftBottom = {}, rightTop = {}, rightBottom = {};
                var minStartPoint = {}, maxEndPoint = {};
                var dataPoints = data.getData();
                minStartPoint.x = dataPoints[0].oldPoint.x, minStartPoint.y = dataPoints[0].oldPoint.y;
                maxEndPoint.x = dataPoints[0].oldPoint.x, maxEndPoint.y = dataPoints[0].oldPoint.y;

                for(var i=0; i<dataPoints.length-2; i++) {
                    if(dataPoints[i+1].oldPoint.x < minStartPoint.x) {
                        minStartPoint.x = dataPoints[i+1].oldPoint.x;
                    }
                    if(dataPoints[i+1].oldPoint.y < minStartPoint.y) {
                        minStartPoint.y = dataPoints[i+1].oldPoint.y;
                    }
                    if(maxEndPoint.x < dataPoints[i+1].oldPoint.x) {
                        maxEndPoint.x = dataPoints[i+1].oldPoint.x;
                    }
                    if(maxEndPoint.y < dataPoints[i+1].oldPoint.y) {
                        maxEndPoint.y = dataPoints[i+1].oldPoint.y;
                    }
                    if(i == dataPoints.length - 2) {
                        if(dataPoints[dataPoints.length-2].newPoint.x < minStartPoint.x) {
                            minStartPoint.x = dataPoints[dataPoints.length-2].newPoint.x;
                        }else if(maxEndPoint.x < dataPoints[dataPoints.length-2].newPoint.x) {
                            maxEndPoint.x = dataPoints[dataPoints.length-2].newPoint.x;
                        }

                        if(dataPoints[dataPoints.length-2].newPoint.y < minStartPoint.y) {
                            minStartPoint.y = dataPoints[dataPoints.length-2].newPoint.y;
                        }else if(maxEndPoint.y < dataPoints[dataPoints.length-2].newPoint.y) {
                            maxEndPoint.y = dataPoints[dataPoints.length-2].newPoint.y;
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
             * @returns {*} : selectDrawing 객체 반환 (canvas 내 객체정보 배열의 index 정보 포함)
             */
            this.selectDrawingEvent = function(event, point) {
                if(event != null) {
                    tool.getPen().setNewPoint(event);
                }else {
                    tool.getPen().setNewPoint(null, point);
                }
                var x = tool.getPen().getNewPoint().x, y = tool.getPen().getNewPoint().y;
                var points = {}, leftTop = {}, leftBottom = {}, rightTop = {}, rightBottom = {};

                var dataArr = tool.getData().slice();
                //거꾸로 순회해서 if 문에서 먼저 인식된 도형 찾으면 종료
                $(dataArr.reverse()).each(function(index, data) {
                    if(data.getType() == 'pencil' || data.getType() == 'brush') {
                        points = self.getSelectAreaPoint(data);

                        leftTop = points.leftTop;
                        leftBottom = points.leftBottom;
                        rightTop = points.rightTop;
                        rightBottom = points.rightBottom;
                    }else if(data.getType() == 'figure') {
                        var figureX = data.getData().coordinate.x, figureY = data.getData().coordinate.y;
                        var figureSize = data.getData().figureType == 'square'? data.getData().figureSize/2 + (data.getLineWidth()/2 + 1) : data.getData().figureSize + (data.getLineWidth()/2 + 1);

                        leftTop.x = figureX - figureSize, leftTop.y = figureY - figureSize,
                        leftBottom.x = figureX - figureSize, leftBottom.y = figureY + figureSize,
                        rightTop.x = figureX + figureSize, rightTop.y = figureY - figureSize,
                        rightBottom.x = figureX + figureSize, rightBottom.y = figureY + figureSize;
                    }

                    //사각 프레임 영역으로 도형 인식
                    if(leftTop.x <= x && x <= rightTop.x
                        && leftTop.y <= y && y <= leftBottom.y) {

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
                        
                        selectDrawing = {
                            drawing : data,
                            index : dataArr.length - 1 - index
                        };
                        return false;
                    }
                });
            };

            /**
             * 선택된 개체 이동
             * @param event
             */
            this.moveSelectDrawingEvent = function(event) {
                tool.getPen().setNewPoint(event);
                var x = tool.getPen().getNewPoint().x, y = tool.getPen().getNewPoint().y;
                var drawing, index;

                if(selectDrawing != null) {
                    drawing = selectDrawing.drawing;
                    index = selectDrawing.index;
                    tool.getContext().clearRect(0, 0, tool.getCanvas().width, tool.getCanvas().height);

                    if(drawing.getType() == 'pencil' || drawing.getType() == 'brush') {
                        var centerPoint = {}, addPoint = {}, movePointArr = [{oldPoint: {}, newPoint: {}}];
                        var points = self.getSelectAreaPoint(drawing);

                        centerPoint.x = points.leftTop.x + (points.rightTop.x - points.leftTop.x)/2;
                        centerPoint.y = points.leftTop.y + (points.leftBottom.y - points.leftTop.y)/2;

                        console.log("중심점-----");
                        console.log(centerPoint);
                        addPoint.x = (x - centerPoint.x);
                        addPoint.y = (y - centerPoint.y);
                        console.log("addPoint-----");
                        console.log(addPoint);

                        for(var i=0; i<drawing.getData().length; i++) {
                            movePointArr[i] = {
                                newPoint: {
                                    x: drawing.getData()[i].newPoint.x + addPoint.x,
                                    y: drawing.getData()[i].newPoint.y + addPoint.y
                                },
                                oldPoint: {
                                    x: drawing.getData()[i].oldPoint.x + addPoint.x,
                                    y: drawing.getData()[i].oldPoint.y + addPoint.y
                                }
                            };
                        }

                        for(var i=0; i<drawing.getData().length; i++) {
                            self.drawDrawingObject('line', null, index, drawing, null, i);
                        }

                        tool.getData()[index].setData(movePointArr);
                    }else if(drawing.getType() == 'figure') {
                        drawing.getData().coordinate.x = x;
                        drawing.getData().coordinate.y = y;
                        self.drawDrawingObject('figure', null, index, drawing, true);

                        tool.getData()[index] = figureData;
                    }
                }
            };

            /**
             * 이벤트 적용전 상태의 캔바스 이미지로 돌아가기
             */
            this.prevCanvasReturn = function() {
                if(tool.getPen().getImageData() != undefined) {
                    tool.getContext().clearRect(0, 0, tool.getCanvas().width, tool.getCanvas().height);
                    tool.getContext().putImageData(tool.getPen().getImageData(), 0, 0);
                }
            };

            /**
             * 캔바스 이벤트
             * @param event
             */
            this.canvasEvent = function(event) {
                if (event.type == 'mousedown') {
                    if (event.button == 0) { // 마우스 왼쪽 버튼
                        isMouseDown = true;
                        switch(tool.getCurrent()) {
                            case 'pencil' :
                            case 'brush' :
                            case 'eraser' :
                                lineData = [];
                            case 'figure' :
                                tool.getPen().setOldPoint(event);
                                tool.getPen().setImageData(tool.getContext().getImageData(0,0,tool.getCanvas().width,tool.getCanvas().height));
                                break;
                            case 'paint' :
                                self.paintEvent(event);
                                break;
                            case 'selectDrawing' :
                                //개체선택 해제
                                self.prevCanvasReturn();
                                selectDrawing = null;
                                self.selectDrawingEvent(event);
                                break;
                        }
                    }
                } else if (event.type == 'mouseup') {
                    isMouseDown = false;
                    if(tool.getCurrent() == 'pencil' || tool.getCurrent() == 'brush') {
                        //선 개체
                        var drawing = new Drawing();
                        drawing.setType(tool.getCurrent());
                        drawing.setData(lineData);
                        drawing.setStrokeStyle(tool.getContext().strokeStyle);
                        drawing.setLineWidth(tool.getContext().lineWidth);
                        drawing.setLineCap(tool.getContext().lineCap);
                        drawing.setFillStyle(tool.getContext().fillStyle == undefined ? null : tool.getContext().fillStyle);
                        drawing.setImageData(tool.getPen().getImageData());

                        //개체 저장
                        tool.getData().push(drawing);
                    }else if(tool.getCurrent() == 'figure') {
                        //개체 저장
                        tool.getData().push(figureData);
                    }

                    if(tool.getCurrent() != 'paint') {
                        tool.getPen().setImageData(tool.getContext().getImageData(0,0,tool.getCanvas().width,tool.getCanvas().height));
                    }
                } else if (event.type == 'mouseover') {
                    isMouseDown = false;
                } else if (event.type == 'mousemove') {
                    if(isMouseDown) {
                        switch(tool.getCurrent()) {
                            case 'pencil' :
                            case 'brush' :
                                self.drawLineEvent(event);
                                break;
                            case 'figure' :
                                tool.getContext().clearRect(0, 0, tool.getCanvas().width, tool.getCanvas().height);
                                self.drawDrawingObject('figure', event, tool.getData().length);
                                break;
                            case 'eraser' :
                                self.eraserEvent(event);
                                break;
                            case 'selectDrawing' :
                                self.moveSelectDrawingEvent(event);
                                break;
                        }
                    }
                }

            }
        };

        return drawingAction;
    });