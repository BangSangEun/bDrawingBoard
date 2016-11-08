/**
 * Pen 객체
 */
define([],
    function() {
        var Pen = function() {
            var _size,
                _color,
                _brush,
                _figure,
                _oldPoint = {x: null, y: null},
                _newPoint = {x: null, y: null},
                _imageData;

            this.getSize = function() {
                return _size;
            };

            this.setSize = function(size) {
                _size = size;
            };

            this.getColor = function() {
                return _color;
            };

            this.setColor = function(color) {
                _color = color;
            };

            this.getBrush = function() {
                return _brush;
            };

            this.setBrush = function(brush) {
                _brush = brush;
            };

            this.getFigure = function() {
                return _figure;
            };

            this.setFigure = function(figure) {
                _figure = figure;
            };

            this.getOldPoint = function() {
                return _oldPoint;
            };

            this.setOldPoint = function(event) {
                if(event == null) {
                    _oldPoint.x = arguments[1].x;
                    _oldPoint.y = arguments[1].y;
                }else {
                    _oldPoint.x = event.offsetX - $(event.target).position().left;
                    _oldPoint.y = event.offsetY - $(event.target).position().top;
                }
            };

            this.getNewPoint = function() {
                return _newPoint;
            };

            this.setNewPoint = function(event) {
                if(event == null) {
                    _newPoint.x = arguments[1].x;
                    _newPoint.y = arguments[1].y;
                }else {
                    _newPoint.x = event.offsetX - $(event.target).position().left;
                    _newPoint.y = event.offsetY - $(event.target).position().top;
                }
            };

            this.getImageData = function() {
                return _imageData;
            };

            this.setImageData = function (imageData) {
                _imageData = imageData;
            };
        };

        return Pen;
});