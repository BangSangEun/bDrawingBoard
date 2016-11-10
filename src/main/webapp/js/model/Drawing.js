/**
 * Drawing 객체
 * @constructor
 */
define([], function() {
    var Drawing = function() {
        var _type,
            _data = {},
            _strokeStyle,
            _lineWidth,
            _lineCap,
            _fillStyle,
            _imageData;

        this.getType = function() {
            return _type;
        };

        this.setType = function(type) {
            _type = type;
        };

        this.getData = function() {
            return _data;
        };

        this.setData = function(data) {
            _data = data;
        };

        this.getStrokeStyle = function() {
            return _strokeStyle;
        };

        this.setStrokeStyle = function(strokeStyle) {
            _strokeStyle = strokeStyle;
        };

        this.getLineWidth = function() {
            return _lineWidth;
        };

        this.setLineWidth = function(lineWidth) {
            _lineWidth = lineWidth;
        };

        this.getLineCap = function() {
            return _lineCap;
        };

        this.setLineCap = function(lineCap) {
            _lineCap = lineCap;
        };

        this.getFillStyle = function() {
            return _fillStyle;
        };

        this.setFillStyle = function(fillStyle) {
            _fillStyle = fillStyle;
        };

        this.getImageData = function() {
            return _imageData;
        };

        this.setImageData = function(imageData) {
            _imageData = imageData;
        };
    };

    return Drawing;
});


