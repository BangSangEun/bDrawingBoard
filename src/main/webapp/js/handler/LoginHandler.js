/**
 * 로그인 관련 이벤트 핸들러
 */

define(['jquery', 'LoginAction'],
    function($, LoginAction) {
        var LoginHandler = function() {
            var self = this;

            /**
             * Login 핸들러
             */
            this.setHandler = function () {
                var loginAction = new LoginAction();

                $('.login-btn').on('click', function (event) {
                    if (event.target.className.indexOf('btn-login') > -1) {
                        loginAction.goLogin();
                    } else {
                        loginAction.goJoin();
                    }
                });

                $('.btn-logout').on('click', function (event) {
                    loginAction.goLogout();
                });
            };
        };

        return LoginHandler;
});
