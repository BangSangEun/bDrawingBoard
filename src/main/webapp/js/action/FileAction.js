/**
 * 파일 관련 Action
 */

define(['jquery', 'DrawingAction', 'Drawing'],
    function($, DrawingAction, Drawing) {
        var FileAction = function(tool) {
            var self = this;
            var fileData = {};

            /**
             * 로컬 파일 다운로드
             */
            this.saveLocalFile = function() {
                location.href = (tool.getCanvas()).toDataURL('image/png').replace("image/png", "image/octet-stream");
                console.log((tool.getCanvas()).toDataURL('image/png').replace("image/png", "image/octet-stream"));
            };

            /**
             * 내 파일 저장 뷰
             * @param view
             */
            this.myFileSaveView = function(view) {
                if(view) {
                    $('#myfile-save').modal();
                }else {
                    $('#myfile-save').modal('hide');
                    $('#filesave-name').val("");
                }
            };

            /**
             * 내 파일 목록 뷰
             * @param view
             */
            this.myFileListView = function(view) {
                if(view) {
                    $('#myfile-list').modal();
                    self.myFileListRead();
                }else {
                    $('#myfile-list .div-list-file table').find('tr').removeClass('on');
                    $('#myfile-list .div-list-file table').find('tr').removeClass('click');
                    ($('#myfile-list .div-list-file table tbody')).html("");
                }
            };

            /**
             * 내 파일 저장
             * @param event
             */
            this.myFileSave = function(event) {
                var file_name = $('#filesave-name').val();

                if(file_name != "") {
                    var file_data = self.getConversionDataToJson(tool.getData());

                    $.ajax({
                        type: 'POST',
                        url: '/setMyFileInfo.do',
                        data: {"file_name": file_name, "file_data": file_data},
                        dataType: 'text',
                        success: function(result) {
                            if(result == 'success') {
                                alert("파일 저장 완료");
                                self.myFileSaveView(false);
                            }else {
                                alert("파일 저장 실패");
                            }
                        },
                        error: function() {
                            alert("파일 저장 오류입니다.\n해당 오류가 지속되면 관리자에게 문의하세요.");
                        }
                    });
                }else {
                    alert("파일명을 입력하세요.");
                }
            };

            /**
             * drawing 객체 배열을 json 형태로 변환
             * @param dataArr
             * @returns {Array}
             */
            this.getConversionDataToJson = function(dataArr) {
                var data, jsonData = {}, jsonArr = [];
                for(var i=0; i<dataArr.length; i++) {
                    data = dataArr[i];
                    if(data != undefined) {
                        jsonData.type = data.getType();
                        jsonData.data = data.getData();
                        jsonData.strokeStyle = data.getStrokeStyle();
                        jsonData.lineWidth = data.getLineWidth();
                        jsonData.fillStyle = data.getFillStyle();

                        jsonArr.push($.extend({}, jsonData));
                    }
                }

                return JSON.stringify(jsonArr);
            };

            /**
             * json 형태를 Drawing 객체 배열로 변환
             * @param jsonData
             */
            this.getConversionJsonToData = function(jsonData) {
                var dataArr = JSON.parse(jsonData);

                for(var i=0; i<dataArr.length; i++) {
                    dataArr[i] = $.extend(new Drawing, dataArr[i]);

                    dataArr[i].setType(dataArr[i].type);
                    dataArr[i].setData(dataArr[i].data);
                    dataArr[i].setStrokeStyle(dataArr[i].strokeStyle);
                    dataArr[i].setLineWidth(dataArr[i].lineWidth);
                    dataArr[i].setFillStyle(dataArr[i].fillStyle);
                }

                return dataArr;
            };

            /**
             * 내 파일 목록 불러오기
             */
            this.myFileListRead = function() {
                $.ajax({
                    type: 'GET',
                    url: '/getMyFileInfoList.do',
                    dataType: 'json',
                    success: function(result) {
                        var appendHtml = "";
                        var listObj = result.myFileInfoList;

                        if(listObj != undefined){
                            for(var i=0; i<listObj.length; i++) {
                                appendHtml += "<tr class=\"list-file\">";
                                appendHtml += "<td class=\"depth-0\" id=\"td-file-" + listObj[i].file_id + "\">";
                                appendHtml += "<p class=\"list-name\">";
                                appendHtml += "<i class=\"tool-ico myfile-ico\"></i>" + decodeURIComponent(listObj[i].file_name).replace(/\+/g, ' ') + "</p>";
                                appendHtml += "<div class=\"list-btn\">";
                                appendHtml += "<a><i class=\"tool-ico savelocal-black-ico\"></i></a>"; // <!-- 다운로드 -->
                                appendHtml += "<a><i class=\"tool-ico editname-ico\"></i></a>"; // <!-- 이름변경 -->
                                appendHtml += "<a><i class=\"tool-ico drawclear-black-ico\"></i></a>"; // <!-- 삭제 -->
                                appendHtml += "</div></td></tr>";

                                fileData[listObj[i].file_id] = listObj[i].file_data;
                            }

                            $('#myfile-list .div-list-file').find('tbody').append(appendHtml);

                            // 내 파일 목록 이벤트
                            var myfile_list_tr = $('#myfile-list .div-list-file table tr');
                            myfile_list_tr.on('mousedown mouseover mouseup mousemove', function(event) {
                                self.myFileListEvent(event);
                            });
                        }
                    },
                    error: function() {
                        alert("파일 목록 조회 오류입니다.\n해당 오류가 지속되면 관리자에게 문의하세요.");
                    }
                });
            };

            /**
             * 내 파일 목록 이벤트
             * @param event
             */
            this.myFileListEvent = function(event) {
                if(event.type == 'mousedown') {
                    var fileDataIndex = $(event.target).parents('td').attr('id') == undefined ? $(event.target).attr('id').split('td-file-')[1] : $(event.target).parents('td').attr('id').split('td-file-')[1];
                    console.log(event);

                    if(event.target.tagName == 'P' || event.target.tagName == 'TD') {
                        // 파일 불러오기
                        $('#myfile-list').find('tr.click').removeClass('click');
                        $(event.currentTarget).addClass('click');

                        var dataArr = self.getConversionJsonToData(fileData[fileDataIndex]);
                        tool.setData(dataArr);

                        var drawingAction = new DrawingAction();
                        drawingAction.init(tool);

                        tool.getContext().clearRect(0, 0, tool.getCanvas().width, tool.getCanvas().height);
                        drawingAction.drawOrderDrawing('prev', tool.getData().length);
                        tool.getPen().setImageData(tool.getContext().getImageData(0,0,tool.getCanvas().width,tool.getCanvas().height));

                        $('#myfile-list').modal('hide');
                    }else if(event.target.className.indexOf("savelocal") > -1) {
                        // 파일 다운로드
                        //location.href = fileData[fileDataIndex].imgUrl;
                    }else if(event.target.className.indexOf("editname") > -1) {
                        // 파일 이름변경

                    }else if(event.target.className.indexOf("drawclear") > -1) {
                        // 파일 삭제

                    }
                }else if(event.type == 'mouseover') {
                    $('#myfile-list').find('tr.on').removeClass('on');
                    $(event.currentTarget).addClass('on');
                }
            }

        };

        return FileAction;
});