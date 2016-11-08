/**
 * 파일 관련 이벤트 핸들러
 */

define(['jquery', 'FileAction'],
    function($, FileAction) {
        var FileEventHandler = function() {
            var fileAction;

            /**
             * 초기화
             * @param tool
             */
            this.init = function(tool) {
                fileAction = new FileAction(tool);

                $('#myfile-list').on('hide.bs.modal', function () {
                    fileAction.myFileListView(false);
                });
            };

            /**
             * File 핸들러
             * @param initializer
             * @param event
             */
            this.setHandler = function(event) {
                //내 파일 저장 뷰 이벤트
                if($(event.target).parents('#myfile-save').length > 0) {
                    if (event.type == 'mousedown') {
                        if (event.target.id == 'myfile-save-btn') {
                            fileAction.myFileSave(event);
                        }
                    }
                }else if(event.target.id.indexOf('menu-') > -1) {
                    if (event.type == 'mousedown') {
                        if (event.target.id == 'menu-saveLocal') {
                            //로컬 파일 저장
                            fileAction.saveLocalFile();
                        } else if (event.target.id == 'menu-saveFile') {
                            //내 파일 저장 뷰
                            fileAction.myFileSaveView(true);
                        } else if (event.target.id == 'menu-myFileList') {
                            //내 파일 목록 뷰
                            fileAction.myFileListView(true);
                        }
                    }
                }
            }
        };

        return FileEventHandler;
});