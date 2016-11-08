/**
 * 로그인 관련 Action
 */

define(['jquery'],
    function($) {
        var LoginAction = function() {
            var self = this;

            /**
             * 로그인
             */
            this.goLogin = function () {
                var vali_obj = ['member_id', 'member_pw'];
                for (var i = 0; i < vali_obj.length; i++) {
                    var obj = $("input[name=" + vali_obj[i] + "]");
                    if (obj.val() == undefined || obj.val() == null || obj.val() == "") {

                        alert("'" + $(obj).parent('div').prev('label').text() + "'를 입력하세요.");
                        return;
                    }
                }

                $.ajax({
                    type: 'POST',
                    url: '/login/memberInfoCheck.do',
                    data: $('#loginForm').serialize(),
                    dataType: 'text',
                    success: function (result) {
                        if (result == 'success') {
                            $('#loginForm').submit();
                            if($('#saveId').is(":checked")) {
                                localStorage.saveid = $("input[name=member_id]").val();
                            }
                        } else {
                            alert("ID와 Password를 다시 확인해 주세요.");
                        }
                    },
                    error: function () {
                        alert("로그인 오류 입니다.\n해당 오류가 지속되면 관리자에게 문의하세요.");
                    }
                });
            };

            /**
             * 로그아웃
             */
            this.goLogout = function () {
                location.href = "/goLogout.do";
            }

            /**
             * 회원가입 페이지 이동
             */
            this.goJoin = function () {
                //회원가입 페이지 이동
            };
        };

        return LoginAction;
});