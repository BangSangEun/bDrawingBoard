/**
 * 그림판 관련 이벤트 핸들러
 */


define(['jquery', 'DrawingAction', 'GradientAction'],
    function($, DrawingAction, GradientAction) {
        var DrawingEventHandler = function() {
            var drawingAction, gradientAction;

            /**
             * 초기화
             * @param tool
             */
            this.init = function(tool) {
                drawingAction = new DrawingAction();
                drawingAction.init(tool);
                gradientAction = new GradientAction();
                gradientAction.init(tool);
            };

            /**
             * Drawing 핸들러
             * @param tool
             * @param event
             */
            this.setHandler = function(event) {
                if(event.target.id == 'drawing-canvas') {
                    //캔바스 그리기 이벤트
                    drawingAction.canvasEvent(event);
                }else if($(event.target).parents('div#gradient-option-view').length > 0) {
                    //그라데이션 옵션 이벤트
                    gradientAction.setHandler(event);
                }else {
                    if(event.type == 'mousedown') {
                        if(event.target.id.indexOf('tool') > -1) {
                            //툴 선택
                            drawingAction.toolSelect(event);
                        }else if($(event.target).parents('div.color-pallet').length > 0) {
                            //색상 선택
                            drawingAction.colorSelect(event);
                        }else if(event.target.id.indexOf('drawClear') > -1) {
                            //새로그리기 선택
                            drawingAction.cleaerCanvas();
                        }
                    }else if(event.type == 'change') {
                        if($(event.target).parents('div#brush-shape').length > 0) {
                            //브러쉬 모양 선택
                            drawingAction.brushSelect(event);
                        }else if($(event.target).parents('div[id$=penSize]').length > 0) {
                            //펜 사이즈 선택
                            drawingAction.penSizeSelect(event);
                        }else if($(event.target).parents('div#figure-shape').length > 0) {
                            //도형 선택
                            drawingAction.figureSelect(event);
                        }else if($(event.target).parents('div#paint-option').length > 0) {
                            //채우기 옵션 선택
                            drawingAction.paintOptionSelect(event);
                        }
                    }
                }
            }
        };

        return DrawingEventHandler;
});


