/**
 * 초기화 클래스
 */

define(['jquery', 'Tool', 'Util', 'DrawingEventHandler', 'FileEventHandler'],
    function($, Tool, Util, DrawingEventHandler, FileEventHandler) {
        var Initializer = function() {
            var self = this;
            var tool;

            /**
             * 초기화 함수
             */
            this.init = function() {
                tool = new Tool();
                self.initCanvas();
                self.initTool();

                var util = new Util();
                util.createColorPicker($('.color-pallet'));
                self.eventBinder();
                $('.selectpicker').selectpicker();
            };

            /**
             * 이벤트 바인딩
             */
            this.eventBinder = function() {
                    //======================================= file
                var file_menu = $(".navi-menu").find("[id^=menu-]"),
                    myfile_save_btn = $('#myfile-save-btn');
                    //======================================= drawing
                    drawing_tool = $(".drawing-tool").find('li').find('button'),
                    drawing_canvas = $("#drawing-canvas"), /* canvas board */
                    pallet_tool_color = $(".color-pallet").find('li'),
                    pallet_tool = $("div[class^=pallet-]").find('select'),
                    drawclear = $("#menu-drawClear"), /* clear */
                    gradient_option = $('#gradient-option'); /* 그라데이션 옵션 메뉴 */

                var fileEventObj = [file_menu, myfile_save_btn];
                var drawEventObj = [drawing_tool, drawing_canvas, pallet_tool_color, pallet_tool, drawclear, gradient_option];

                var fileEventHandler = new FileEventHandler();
                fileEventHandler.init(tool);
                for(var i=0; i<fileEventObj.length; i++) {
                    fileEventObj[i].on('mousedown keydown mouseover mouseup mousemove', function(event) {
                        fileEventHandler.setHandler(event);
                    });
                }

                var drawingEventHandler = new DrawingEventHandler();
                drawingEventHandler.init(tool);
                for(var i=0; i<drawEventObj.length; i++) {
                    drawEventObj[i].on('mousedown keydown mouseover mouseup mousemove change', function(event) {
                        drawingEventHandler.setHandler(event);
                    });
                }
            };

            /**
             * 캔버스 초기화
             */
            this.initCanvas = function() {
                (tool.getCanvas()).width = $('.drawing-board').css('width').split('px')[0] - 2;
                (tool.getCanvas()).height = $('.drawing-board').css('height').split('px')[0] - 2;
            };

            /**
             * 툴 도구 초기화
             */
            this.initTool = function() {
                tool.setCurrent($('.drawing-tool').find('li > button').attr('id').split('tool-')[1]);
                tool.getPen().setColor($('.color-pallet').find('ul > li:eq(0)').css('background-color'));
                $('.drawing-tool').find('ul > li:eq(0) > button').addClass("active");

                tool.getPen().setSize($('.penSize-pallet:visible').find('select option:eq(0)').val());
                tool.getPen().setBrush($('#brush-shape').find('select option:eq(0)').val());
                tool.getPen().setFigure($('#figure-shape').find('select option:eq(0)').val());
                $(tool.getCanvas()).css('cursor', 'url(/image/icon/cursor/pencil.cur) 4 12, auto');
            };
        };

        return Initializer;
});
