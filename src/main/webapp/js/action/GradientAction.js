/**
 * 그라데이션 기능 Action
 */

define(['jquery', 'Util'],
    function($, Util) {
        var GradientAction = function() {
            var self = this;
            var isMouseDown;
            var breakpoint;

            /**
             * 초기화
             */
            this.init = function() {
                var util = new Util();
                util.createColorPicker($('.gradient-color-pallet').find('.popover-content'));
                self.initBreakPoint();
            };

            /**
             * 그라데이션 옵션 뷰 이벤트
             * @param event
             */
            this.setHandler = function (event) {
                if(event.type == 'mousedown') {
                    if(event.button == 0) { // 마우스 왼쪽 버튼
                        if ($(event.target).parent('button.close').length > 0) {
                            if($(event.target).parents('.gradient-color-pallet').length > 0) {
                                //색상표 팝업 닫기
                                $('.gradient-color-pallet').hide();
                                $('#gradient-color').removeClass('active');
                            }else {
                                //그라데이션 팝업 닫기
                                $('#gradient-option-view').hide();
                            }
                        }else if($(event.target).parent('.breakpoint').length > 0) {
                            //중지점 선택 이벤트
                            isMouseDown = true;
                            self.selectBreakPointEvent($(event.target).parent('.breakpoint'));
                        }else if(event.target.id == 'gradient-color' || $(event.target).parent('#gradient-color').length > 0) {
                            //색 선택창
                            if ($('#gradient-color').hasClass('active')) {
                                $('#gradient-color').removeClass('active');
                                $('.gradient-color-pallet').hide();
                            } else {
                                $('#gradient-color').addClass('active');
                                $('.gradient-color-pallet').show();
                            }
                        }else if($(event.target).parents('.gradient-color-pallet').length > 0
                            && $(event.target).parent('ul').length > 0) {
                            //색 선택 이벤트
                            self.selectColor(breakpoint, $(event.target));
                            self.moveBreakPointEvent(null, breakpoint, $(breakpoint).attr('gradient-position'));  //중지점 위치 초기화
                        }
                    }
                }else if(event.type == 'mouseup') {
                    isMouseDown = false;
                }else if(event.type == 'mousemove') {
                    if(isMouseDown) {
                        if(event.target.className == 'breakpoint-area') {
                            //중지점 이동 이벤트
                            self.moveBreakPointEvent(event, breakpoint);
                        }
                    }
                }else if(event.type == 'change') {
                    if(event.target.id == 'gradient-degree') {
                        //각도 값 변경 후 체크
                        self.degreeValidation(event);
                    }else if ($(event.target).parents('#gradient-type').length > 0) {
                        //종류 변경시 이벤트 - ('선형' 선택 시에만 각도 변경 가능)
                        var type = self.getType();
                        $('#gradient-direction').find('div[id$=direction]').hide();
                        if(type == 'line') {
                            $('#gradient-degree').removeAttr('disabled');
                            $('#line-direction').show();
                        }else if(type == 'radial') {
                            $('#gradient-degree').attr('disabled', 'disabled');
                            $('#radial-direction').show();
                        }
                    }else if($(event.target).parents('#gradient-direction').length > 0) {
                        //방향 변경시 이벤트
                        $('#gradient-degree').val(self.getDirection());
                    }
                }else if(event.type == 'keydown') {
                    if(event.target.id == 'gradient-degree') {
                        if(!(48 <= event.keyCode && event.keyCode <= 57 || event.keyCode == 8 || event.keyCode == 13
                            || event.keyCode == 46 || 37 <= event.keyCode && event.keyCode <= 40)) {
                            event.preventDefault();
                        }
                    }
                }
            };

            /**
             * 각도 값 체크 이벤트
             * @param event
             */
            this.degreeValidation = function(event) {
                var degree = $(event.target).val();
                if(degree > 359.9 || degree < 0) {
                    alert("각도 값은 0~359.9까지의 값 입니다.");
                    if(degree > 359.9) {
                        $(event.target).val(359.9);
                    }else {
                        $(event.target).val(0);
                    }
                }else if(degree == '') {
                    $(event.target).val(0);
                }else if(degree.substring(0,1) == '0') { //수정필요
                    degree = degree.substring(1,degree.length);
                    $(event.target).val(degree);
                }
            };

            /**
             * 그라데이션 스타일 세팅
             * @param context : canvas DOM 객체의 context
             * @param gradientData : 그라데이션 데이터
             * @param isBreakPointBar : 그라데이션 옵션 뷰의 중지점 바 여부
             */
            this.setGradientFillStyle = function(context, gradientData, isBreakPointBar) {
                var point = gradientData.point;
                var startBreakPoint = point[0], endBreakPoint = point[point.length - 1];
                var gradient;

                if(isBreakPointBar == 'breakbar' || self.getType() == 'line') { //선형
                    gradient = context.createLinearGradient(startBreakPoint.x, startBreakPoint.y, endBreakPoint.x, endBreakPoint.y);
                }else if(self.getType() == 'radial') { //방사형
                    gradient = context.createRadialGradient(startBreakPoint.x, startBreakPoint.y, startBreakPoint.radius, endBreakPoint.x, endBreakPoint.y, endBreakPoint.radius);
                }

                $(point).each(function() {
                    gradient.addColorStop(this.position * 0.01, this.color); //addColorStop의 첫번째 값은 중지점 백분율 값
                });

                context.fillStyle = gradient;
            };

            /**
             * 각도 값 반환
             * @returns {*|jQuery}
             */
            this.getDegree = function() {
                return $('#gradient-degree').val();
            };
            
            /**
             * 그라데이션 종류 값 반환
             * @returns {*|jQuery}
             */
            this.getType = function() {
                return $('#gradient-type').find('.dropdown-menu').find('li.selected > a').attr('data-tokens');
            };

            /**
             * 그라데이션 방향 값 반환
             * @returns {*|jQuery}
             */
            this.getDirection = function() {
                var direction = $('#' + self.getType() + '-direction').find('.dropdown-menu').find('li.selected > a').attr('data-tokens');
                if(direction == "null") direction = 0;
                return direction;
            };

            /**
             * 그라데이션 종류별 gradientData 객체 반환
             * @param objPoint
             * @param objSize
             * @returns {*}
             */
            this.getTypeGradientData = function(objPoint, objSize) {
                var type = self.getType(), pointArr, gradientData;

                if(type == 'line') {
                    pointArr = self.getDegreePoint(self.getDegree(), objPoint, objSize);
                }else if(type == 'radial') {
                    pointArr = self.getRadialDirectionPoint(self.getDegree(), objPoint, objSize);
                }

                gradientData = self.getGradientData(pointArr);

                return gradientData;
            };


            /**
             * 방사형 방향에 따른 point 객체 반환
             */
            this.getRadialDirectionPoint = function(degree, objPoint, objSize) {
                var startPoint = {}, endPoint = {}, tempPoint = [];
                var x = objPoint.x, y = objPoint.y;

                if(degree == '0') {
                    //가운데
                    startPoint.x = x;
                    startPoint.y = y;
                }else if(degree == '45') {
                    //왼쪽 위 모서리
                    startPoint.x = x - objSize;
                    startPoint.y = y - objSize;
                }else if(degree == '135') {
                    //오른쪽 위 모서리
                    startPoint.x = x + objSize;
                    startPoint.y = y - objSize;
                }else if(degree == '225') {
                    //오른쪽 아래 모서리
                    startPoint.x = x + objSize;
                    startPoint.y = y + objSize;
                }else if(degree == '315') {
                    //왼쪽 아래 모서리
                    startPoint.x = x - objSize;
                    startPoint.y = y + objSize;
                }

                startPoint.radius = 0;
                endPoint.x = startPoint.x;
                endPoint.y = startPoint.y;
                endPoint.radius = objSize * 2;

                tempPoint = [startPoint, endPoint];

                return tempPoint;
            };

            /**
             * 각도 값에 따른 point 객체 반환
             * @param degree : 그라데이션 각도
             * @param objPoint : 적용 객체 point (중심점)
             * @param objSize : 적용 객체 size
             * @returns {Array}
             */
            this.getDegreePoint = function(degree, objPoint, objSize) {
                var startPoint = {}, endPoint = {}, tempPoint = [];
                var x = objPoint.x, y = objPoint.y;
                var temp = (objSize * 2) / 90;

                degree = parseFloat(degree) + 45;
                if(360 < degree) {
                    degree = degree - 360;
                }

                if(90 < degree && degree <= 180) {
                    degree = degree - 90;
                    startPoint.x = (x - objSize) + temp * degree;
                    startPoint.y = y - objSize;
                    endPoint.x = (x + objSize) - temp * degree;
                    endPoint.y = y + objSize;
                }else if(180 < degree && degree <= 270) {
                    degree = degree - 180;
                    startPoint.x = x + objSize;
                    startPoint.y = (y - objSize) + temp * degree;
                    endPoint.x = x - objSize;
                    endPoint.y = (y + objSize) - temp * degree;
                }else if(270 < degree && degree <= 360) {
                    degree = degree - 270;
                    startPoint.x = (x + objSize) - temp * degree;
                    startPoint.y = y + objSize;
                    endPoint.x = (x - objSize) + temp * degree;
                    endPoint.y = y - objSize;
                }else { // 0 < degree <= 90 || 315 < degree
                    startPoint.x = x - objSize;
                    startPoint.y = (y + objSize) - temp * degree;
                    endPoint.x = x + objSize;
                    endPoint.y = (y - objSize) + temp * degree;
                }

                tempPoint = [startPoint, endPoint];

                return tempPoint;
            };

            /**
             * 그라데이션 데이터 정보 반환
             * @param objPoint
             * @param objSize
             * @returns {{point: Array, degree: (*|jQuery)}|*}
             */
            this.getGradientData = function(pointArr) {
                var gradientData, point = [];
                var breakPoint = $('.breakpoint'); //모든 breakpoint 개체

                $(pointArr).each(function(index, item) {
                    point[index] = {
                        x: this.x,
                        y: this.y,
                        color: $(breakPoint[index]).attr('gradient-color'),
                        position: $(breakPoint[index]).attr('gradient-position'),
                        radius: this.radius
                    };
                });

                gradientData = {
                    point: point,
                    degree: self.getDegree()
                };

                return gradientData;
            };

            /**
             * 중지점 개체 초기화
             * @param objData
             */
            this.initBreakPoint = function() {
                var point = [{x: 0, y: 10}, {x: 100, y: 10}];
                var pointColor = [$('.gradient-color-pallet').find('.popover-content').find('li:eq(0)'), $('.gradient-color-pallet').find('.popover-content').find('li:eq(1)')];
                var gradientData;

                $('.breakpoint').each(function(index) {
                    self.selectColor(this, pointColor[index]);  //색 초기화
                    $(this).attr('gradient-position', point[index].x); //중지점 위치 속성 초기화
                });

                $('.breakpoint').each(function(index) {
                    self.moveBreakPointEvent(null, this, point[index].x);  //중지점 위치 초기화
                });

                gradientData = self.getGradientData(point);
                self.setBreakPointBar(gradientData);

                breakpoint = $('.breakpoint')[0];
                self.selectBreakPointEvent(breakpoint); //중지점 선택 이벤트
            };

            /**
             * 중지점 바 세팅
             */
            this.setBreakPointBar = function(gradientData) {
                var canvas = document.getElementById("gradient-breakpoint-bar");
                var context = canvas.getContext("2d");

                var gradient = self.setGradientFillStyle(context, gradientData, 'breakbar');
                context.fillRect(0,0,100,20);
            };

            /**
             * 중지점 선택 이벤트
             * @param breakpointObj : 중지점 개체
             */
            this.selectBreakPointEvent = function(breakpointObj) {
                breakpoint = breakpointObj;
                $('#gradient-position').val($(breakpoint).attr('gradient-position')); //위치 값
                $('#gradient-color').find('p').css('background-color', $(breakpoint).attr('gradient-color')); //색 값

                $('.breakpoint').find('i').removeClass('on');
                $('.breakpoint').find('i').addClass('off');

                //해당 breakpoint 개체 선택
                $(breakpoint).find('i').removeClass('off');
                $(breakpoint).find('i').addClass('on');
            };

            /**
             * 중지점 이동 이벤트
             * @param event
             */
            this.moveBreakPointEvent = function(event, breakpoint, position) {
                var position, gradientData, pointArr = [];

                if(event != null) {
                    var moveX = event.offsetX;

                    if(moveX <= 0) {
                        position = 0;
                    }else if(100 <= moveX) {
                        position = 100;
                    }else if(0 <= moveX && moveX <= 100) {
                        position = moveX;
                    }
                }else {
                    position = position;
                }

                $(breakpoint).css('left', position);
                $(breakpoint).attr('gradient-position', position); //위치
                $('#gradient-position').val(position);

                $('.breakpoint').each(function() {
                    pointArr.push({x: parseInt($(this).attr('gradient-position')), y: 10});
                });

                gradientData = self.getGradientData(pointArr);
                self.setBreakPointBar(gradientData);
            };

            /**
             * 색 선택 이벤트
             * @param obj : li
             */
            this.selectColor = function(breakpoint, obj) {
                var color = $(obj).css('background-color');
                $(breakpoint).attr('gradient-color', color);
                $('#gradient-color').find('p').css('background-color', color);
                $(obj).siblings('li').removeClass('on');
                $(obj).addClass('on');
            };

        };

        return GradientAction;
    });