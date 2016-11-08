package bDrawingBoard.module.main.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * file         :  mainController
 * description  :
 * date         :  2016-09-08
 * author       :  owner
 */
@Controller
public class MainController {

    @RequestMapping("/main.do")
    public String mainView() {
        return "main";
    }
}
