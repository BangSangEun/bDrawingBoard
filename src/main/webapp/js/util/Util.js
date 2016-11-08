/**
 * 초기화 클래스
 */

define(['jquery'],
    function($) {
        var Util = function() {
            var self = this;

            var colorArr = [ //색상표
                '#000000',
                '#FFFFFF',
                '#CCCCCC',
                '#ff0000',
                '#FF7F00',
                '#FFFF00',
                '#009900',
                '#082567',
                '#8000FF',
                '#FF7493',
                '#abeda6',
                '#CD426B'
            ];

            /**
             * 색상표 생성
             * @param obj
             */
            this.createColorPicker = function(obj) {
                var colorPicker = "<ul>";
                for(var i=0; i<colorArr.length; i++) {
                    colorPicker += "<li style='background-color:" + colorArr[i] + "'";
                    if(i == 0){
                        colorPicker += " class='on'";
                    }
                    colorPicker += "></li>";
                }
                colorPicker += "</ul>";

                obj.append(colorPicker);
            }
        };

        return Util;
    });
