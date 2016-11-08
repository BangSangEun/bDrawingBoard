package bDrawingBoard.common.interceptor;

import bDrawingBoard.module.login.vo.MemberVO;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

public class SessionInterceptor extends HandlerInterceptorAdapter {

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
		HttpSession session = request.getSession();
		MemberVO memberVO = (MemberVO)session.getAttribute("memberVO");

		/**
		 * 로그인 세션 확인
		 */
		if(memberVO == null) {
		    if(!(request.getServletPath().equals("/login.do")
		    		|| request.getServletPath().equals("/goLogin.do")
                    || request.getServletPath().equals("/goLogout.do"))) {
                /**
                 * 비로그인 처리
                 */
                response.sendRedirect(request.getContextPath() + "/");
                System.out.println("session empty!");

                return false;
            }
		}else {
			if(request.getServletPath().equals("/login.do")) {
				response.sendRedirect(request.getContextPath() + "/main.do");
			}
		}

		return true;
	}
}
