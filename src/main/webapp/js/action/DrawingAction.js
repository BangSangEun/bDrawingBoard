/**
 *  그림판 관련 Action
 */

define(['jquery', 'GradientAction', 'Drawing'],
    function($, GradientAction, Drawing) {
        var drawingAction = function() {
            var self = this;
            var paintOption;
            var figureData;
            var lineData;
            var isMouseDown;
            var gradientAction;
            var tool;

            /**
             * 초기화
             * @param toolObj
             */
            this.init = function(toolObj) {
                gradientAction = new GradientAction();
                tool = toolObj;
                paintOption = $('#paint-option').find('.selectpicker option:eq(0)').attr('data-tokens');
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
            this.drawLineEvent = function(event) {
                tool.getPen().setNewPoint(event);
                tool.getContext().lineWidth = tool.getPen().getSize(); //라인 굵기
                tool.getContext().strokeStyle = tool.getPen().getColor(); //라인 색상
                tool.getContext().lineCap = tool.getPen().getBrush(); //끝 부분 모양 (round, butt, square 가 있음)

                tool.getContext().beginPath();
                tool.getContext().moveTo(tool.getPen().getOldPoint().x, tool.getPen().getOldPoint().y);
                tool.getContext().lineTo(tool.getPen().getNewPoint().x, tool.getPen().getNewPoint().y);
                tool.getContext().stroke();
                lineData.push({oldPoint: $.extend({}, tool.getPen().getOldPoint()), newPoint: $.extend({}, tool.getPen().getNewPoint())});

                tool.getPen().setOldPoint(null, tool.getPen().getNewPoint());
            };

            /**
             * 도형 그리기 이벤트
             * @param event
             */
            this.drawFigureEvent = function(event, drawing) {
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
                    fillStyle = paintOption == 'single' ? tool.getPen().getColor() : figure.getFillStyle();
                }

                tool.getContext().clearRect(0, 0, tool.getCanvas().width, tool.getCanvas().height);
                tool.getContext().putImageData(tool.getPen().getImageData(), 0, 0);
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

                return figureData;
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
                var obj = self.selectDrawingEvent(event);

                //개체선택 해제
                self.prevCanvasReturn();

                if(obj != undefined) {
                    if(paintOption == 'gradient') {
                        var gradientData = gradientAction.getTypeGradientData(obj.drawing.getData().coordinate, obj.drawing.getData().figureSize);
                        gradientAction.setGradientFillStyle(tool.getContext(), gradientData, obj.drawing);
                        obj.drawing.setFillStyle(tool.getContext().fillStyle);
                    }

                    figureData = self.drawFigureEvent(null, obj.drawing);
                    tool.getData()[obj.index] = figureData;
                    tool.getPen().setImageData(tool.getContext().getImageData(0,0,tool.getCanvas().width,tool.getCanvas().height));
                }
            };

            /**
             * 개체 선택
             * @param event
             * @returns {*} : selectDrawing 객체 반환 (canvas 내 객체정보 배열의 index 정보 포함)
             */
            this.selectDrawingEvent = function(event) {
                tool.getPen().setNewPoint(event);
                var x = tool.getPen().getNewPoint().x, y = tool.getPen().getNewPoint().y;
                var leftTop = {}, leftBottom = {}, rightTop = {}, rightBottom = {};
                var selectDrawing, inDrawing = false;

                var dataArr = tool.getData().slice();
                //거꾸로 순회해서 if 문에서 먼저 인식된 도형 찾으면 종료
                $(dataArr.reverse()).each(function(index, data) {
                    if(data.getType() == 'pencil' || data.getType() == 'brush') {
                        var arrPoint = data.getData();
                        var minStartPoint = {}, maxEndPoint = {};
                        minStartPoint.x = arrPoint[0].oldPoint.x, minStartPoint.y = arrPoint[0].oldPoint.y;
                        maxEndPoint.x = arrPoint[0].oldPoint.x, maxEndPoint.y = arrPoint[0].oldPoint.y;
                        for(var i=0; i<arrPoint.length-2; i++) {
                            if(arrPoint[i+1].oldPoint.x < minStartPoint.x) {
                                minStartPoint.x = arrPoint[i+1].oldPoint.x;
                            }
                            if(arrPoint[i+1].oldPoint.y < minStartPoint.y) {
                                minStartPoint.y = arrPoint[i+1].oldPoint.y;
                            }
                            if(maxEndPoint.x < arrPoint[i+1].oldPoint.x) {
                                maxEndPoint.x = arrPoint[i+1].oldPoint.x;
                            }
                            if(maxEndPoint.y < arrPoint[i+1].oldPoint.y) {
                                maxEndPoint.y = arrPoint[i+1].oldPoint.y;
                            }
                            if(i == arrPoint.length-2) {
                                if(arrPoint[arrPoint.length-2].newPoint.x < minStartPoint.x) {
                                    minStartPoint.x = arrPoint[arrPoint.length-2].newPoint.x;
                                }else if(maxEndPoint.x < arrPoint[arrPoint.length-2].newPoint.x) {
                                    maxEndPoint.x = arrPoint[arrPoint.length-2].newPoint.x;
                                }

                                if(arrPoint[arrPoint.length-2].newPoint.y < minStartPoint.y) {
                                    minStartPoint.y = arrPoint[arrPoint.length-2].newPoint.y;
                                }else if(maxEndPoint.y < arrPoint[arrPoint.length-2].newPoint.y) {
                                    maxEndPoint.y = arrPoint[arrPoint.length-2].newPoint.y;
                                }
                            }
                        }

                        leftTop.x = minStartPoint.x - data.getLineWidth(), leftTop.y = minStartPoint.y - data.getLineWidth(),
                        leftBottom.x = minStartPoint.x - data.getLineWidth(), leftBottom.y = maxEndPoint.y + data.getLineWidth(),
                        rightTop.x = maxEndPoint.x + data.getLineWidth(), rightTop.y = minStartPoint.y - data.getLineWidth(),
                        rightBottom.x = maxEndPoint.x + data.getLineWidth(), rightBottom.y = maxEndPoint.y + data.getLineWidth();
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
                        inDrawing = true;

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

                if(!inDrawing) {
                    //개체선택 해제
                    self.prevCanvasReturn();
                }

                return selectDrawing;
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
                        drawing.setFillStyle(tool.getContext().fillStyle == undefined ? null : tool.getContext().fillStyle);
                        drawing.setImageData(tool.getPen().getImageData());

                        //개체 저장
                        tool.getData().push(drawing);
                    }else if(tool.getCurrent() == 'figure') {
                        //개체 저장
                        tool.getData().push(figureData);
                    }

                    if(tool.getCurrent() != 'selectDrawing' && tool.getCurrent() != 'paint') {
                        tool.getPen().setImageData(tool.getContext().getImageData(0,0,tool.getCanvas().width,tool.getCanvas().height));
                    }

                    console.log(tool.getData());
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
                                self.drawFigureEvent(event);
                                break;
                            case 'eraser' :
                                self.eraserEvent(event);
                                break;
                        }
                    }
                }

            }
        };

        return drawingAction;
    });