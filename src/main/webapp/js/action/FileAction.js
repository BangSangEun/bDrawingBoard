/**
 * 파일 관련 Action
 */

define(['jquery'],
    function($) {
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
                    //file로 떨궈서 가져오도록 수정해야 함. -- 수정필요
                    var file_url = (tool.getCanvas()).toDataURL('image/png').replace("image/png", "image/octet-stream");

                    $.ajax({
                        type: 'POST',
                        url: '/setMyFileInfo.do',
                        data: {"file_name": file_name, "file_url": file_url, "file_data": tool.getData()},
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
                        console.log(listObj);
                        for(var i=0; i<listObj.length; i++) {
                            appendHtml += "<tr class=\"list-file\">";
                            appendHtml += "<td class=\"depth-0\" id=\"td-file-" + listObj[i].file_id + "\">";
                            appendHtml += "<p class=\"list-name\">";
                            appendHtml += "<i class=\"tool-ico myfile-ico\"></i>" + decodeURIComponent(listObj[i].file_name) + "</p>";
                            appendHtml += "<div class=\"list-btn\">";
                            appendHtml += "<a><i class=\"tool-ico savelocal-black-ico\"></i></a>"; // <!-- 다운로드 -->
                            appendHtml += "<a><i class=\"tool-ico editname-ico\"></i></a>"; // <!-- 이름변경 -->
                            appendHtml += "<a><i class=\"tool-ico drawclear-black-ico\"></i></a>"; // <!-- 삭제 -->
                            appendHtml += "</div></td></tr>";

                            fileData[listObj[i].file_id] = {
                                data : listObj[i].file_data,
                                imgUrl : listObj[i].file_url
                            };
                        }

                        $('#myfile-list .div-list-file').find('tbody').append(appendHtml);

                        // 내 파일 목록 이벤트
                        var myfile_list_tr = $('#myfile-list .div-list-file table tr');
                        myfile_list_tr.on('mousedown keydown mouseover mouseup mousemove', function(event) {
                            self.myFileListEvent(event);
                        });
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

                        var img = new Image();
                        img.src = fileData[fileDataIndex].imgUrl;
                        img.onload = function() {
                            tool.getContext().drawImage(img, 0, 0);
                        };
                        $('#myfile-list').modal('hide');
                    }else if(event.target.className.indexOf("savelocal") > -1) {
                        // 파일 다운로드
                        location.href = fileData[fileDataIndex].imgUrl;
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