/**
 * 툴 도구 객체
 */
define(['Pen'],
    function(Pen) {
        var Tool = function() {
            var self = this,
                _current = null,
                _pen = new Pen(),
                _data = [];

            this.getCanvas = function() {
                return document.getElementById("drawing-canvas");
            };

            this.getContext = function() {
                return self.getCanvas().getContext("2d");
            };

            this.getCurrent = function() {
                return _current;
            };

            this.setCurrent = function(current) {
                _current = current;
            };

            this.getPen = function() {
                return _pen;
            };

            this.setPen = function(pen) {
                _pen = pen;
            };

            this.getData = function () {
                return _data;
            };

            this.setData = function(data) {
                _data = data;
            };
        };

        return Tool;
});