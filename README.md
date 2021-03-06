# Web Drawing Board (bDrawingBoard)

Web Drawing Board 프로젝트는 웹 그림판 형태를 목표로 구현한 프로젝트 입니다. <br/>
Spring과 Javascript를 사용하며 그리기 기능과 그림 파일을 저장하고 불러오는 기능들이 구현되어 있습니다. <br/>
누구든 이 프로젝트를 확장하여 더 풍부한 웹 그림판 기능을 가질 수 있도록 참여해주셔도 좋습니다. :blush: :sparkles:<br/>

[![email](https://img.shields.io/badge/email-bsangeun61@gmail.com-blue.svg)](mailto:bsangeun61@gmail.com)

<br/>
> # 화면

<br/>
![view_img](http://i.imgur.com/l0q0NHR.png)

<br/>
> **Note :**

> - 화면 UI의 형태는 bootstrap을 사용하여 디자인 되었습니다.


<br/>
> # 개발 환경

* **IDE :** intelliJ IDEA 2016.2.2
* **java version :** 1.8.0_101
* **servlet/Spring :** Spring 4.3.2.RELEASE
* **Maven :** 3.3.9
* **HTML5, CSS3**
* **Mybatis : 3.4.1**
* **tomcat version :** 8.5.5
* **DB :** H2 내장 DB
* **jQuery JS, RequireJS, bootstrap JS** lib
* **Version Control System :** GitHub

<br/>
> # 프로젝트 IDE 실행

1. 개발 환경에 맞는 JDK와 Maven을 설치합니다.
  - JDK :
    http://www.oracle.com/technetwork/java/javase/downloads/index.html
  - Maven :
    http://maven.apache.org/download.cgi
  - tomcat : 
    http://tomcat.apache.org/
2. 해당 GitHub에 있는 프로젝트 Zip 파일을 내려받습니다.
3. IDE 프로그램에서 프로젝트를 import 한 후, JDK와 Maven을 설정합니다.
4. pom.xml을 reimport하여 프로젝트 내에 필요한 lib 파일들을 import 합니다.
5. tomcat server 설정시 bDrawingBoard:war exploded 파일을 deploy하여 build 될 수 있도록 설정합니다.
6. 서버를 실행시킵니다.


<br/>
> # SPEC

| 기능 | LV.1 | LV.2 | 상세 | 비고 |
 :----: | ---- | ---- | ---- | ----
| 저장 | 로컬 파일 저장 |  | 클라이언트 로컬에 파일을 저장한다. |  |
|  | 서버 파일 저장 | 파일 저장 | DB에 그림 데이터를 저장한다. |  |
|  | 내 파일 목록 | 목록 보기 | 저장한 파일 목록을 볼 수 있다. |  |
|  |  | 불러오기 | 저장한 파일을 불러온다. |  |
|  |  | 삭제 | 저장된 DB 데이터를 삭제한다. |  |
|  |  | 이름 바꾸기 | 해당 파일의 이름을 변경한다. |  |
| 그림판 | 그리기 | 연필 | 일반 라운드 모양의 얇은 크기로 그린다. | 크기조절 4단계 |
|  |  | 브러시 | 브러시 모양을 선택하여 굵은 크기로 그린다. | 크기조절 4단계 |
|  |  | 도형 | 원, 사각, 삼각형 도형을 선택하여 그린다. |  |
|  |  | 채우기 | 도형을 색으로 채운다. | 단색, 그라데이션 |
|  |  | 개체 선택 | 그림 개체 영역을 선택하고 이동할 수 있다. | Delete key 사용시 개체 지움 |
|  |  | 색 팔레트 | 색상을 선택한다. |  |
|  | 새로 그리기 |  | 그림 전체를 지운다. |  |
| 로그인 | 사용자 로그인 |  | 로그인을 한다. | 로그인 후 main으로<br/>이동한다. | 


<br/>
> # 구조

### 자바스크립트 구조
* js
  * action
    * DrawingAction.js
	* FileAction.js
	* GradientAction.js
	* LoginAction.js
  * handler
    * DrawingEventHandler.js
	* FileEventHandler.js
	* LoginHandler.js
  * lib
    * bootstrap.js
	* bootstrap-select.js
	* jquery-3.1.1.min.js
	* require.js
  * model
    * Member.js
	* Pen.js
	* Tool.js
  * util
    * Util.js
  * Initializer.js
  * main.js
<br/>

![javascript_diagram](http://i.imgur.com/tS0Y2Sl.png)

<br/>
> **Note :**

> - **bootstrap, jquery, require JS** 라이브러리 파일들에 **의존**하여 개발되었습니다.
> - 그리기, 파일, 로그인 기능들을 **Handler에서 event binding**을 하고 있으며, 실제 **기능 구현 내용은 Action**에 정의되어 있습니다.
> - 각 기능들에 사용되는 **model 객체 및 util 관련 파일**들을 정의하고 있습니다.

<br/>
### 자바 구조

<img src="http://i.imgur.com/DwsvVU9.png" width="700">

<img src="http://i.imgur.com/npWkn9Y.png" width="700">

> **Note :**

> - 서블릿들은 Spring MVC모델로 방향을 잡고 **Controller와 Service, DAO**의 역할로 분리하였습니다.
> - DI 개념으로 유연하게 Service와 DAO를 분리해서 사용할 수 있는 구조로 구현되어 있습니다.

<br/>
### DB 구조

![java_diagram_2](http://i.imgur.com/suyePj3.png)

> **Note :**

> - 회원 정보를 담는 MEMBER Table과 회원의 그림 저장 정보를 담는 MYFILE_INFO Table이 있습니다.
> - **내장 DB인 H2**를 사용하며 웹 console로도 접근이 가능합니다.

<br/>
> # 기능

SPEC에 명시된 기능들의 상세 내용 입니다.
<br/><br/>

<img src="http://i.imgur.com/tD8OsBP.png" width="700">

### 그리기
> - 빨간색 박스 내의 기능
> - 초록색 박스 내의 옵션 기능

* 새로 그리기
  - Canvas 화면의 내용을 지우고, 배열 Data의 내용을 삭제합니다.
* 연필
  - round의 선모양을 사용 합니다. `lineCap`
  - 색 팔레트의 색깔을 라인 색상으로 가집니다. `strokeStyle`
  - 1, 2, 3, 4(단위 px)의 4가지의 두께를 선택할 수 있습니다. `lineWidth`
* 브러시
  - round, square 의 선 모양을 선택할 수 있습니다. `lineCap`
  - 색 팔레트의 색깔을 라인 색상으로 가집니다. `strokeStyle`
  - 5, 10, 15, 20(단위 px)의 4가지의 두께를 선택할 수 있습니다. `lineWidth`
* 도형
  - 원, 세모, 네모의 도형을 선택할 수 있습니다.
    - 마우스의 시작 포인터 위치를 중점으로 하여 움직이는 마우스 포인터의 직선거리를 계산하여 도형의 크기를 결정하여 그립니다.
  - 1, 5, 10(단위 px)의 3가지 두께를 선택할 수 있습니다. `lineWidth`
  - 최초 도형은 채우기가 없는 상태로 테두리의 색은 색 팔레트의 선택된 색깔을 가집니다. `strokeStyle`
* 채우기
  - 단색과 그라데이션의 옵션을 선택하여 채우기 기능을 실행합니다.
  - 채우기는 해당 영역에 도형 개체가 있는지 확인한 후 기능을 실행합니다.
  - 단색은 색 팔레트의 색깔을 채우기 색상으로 가집니다. `fillStyle`
  - 그라데이션은 그라데이션 채우기 옵션 창에서 각 중지점에 선택된 색과 위치, 각도를 기준으로 만들어진 그라데이션 색상을 가집니다. `fillStyle`
* 개체선택
  - 클릭한 마우스 포인터의 위치가 개체의 영역에 포함되는지 확인한 후 개체 영역이 Dash Line 으로 표시됩니다.
  - 개체선택 상태에서 Delete Key를 사용하면 해당 개체가 삭제됩니다.

<br/>

### 저장 및 불러오기
> - 파란색 박스 내의 기능

* 다운로드
  - 클라이언트의 로컬로 Canvas 그림이 다운로드 됩니다.
  - 파일 확장자는 `.png` 입니다.
* 저장
  - 내장 DB의 myFile_info table의 데이터로 저장됩니다.
  - canvas 내에 그려진 개체들을 그려진 순서로 배열에 객체들을 담아 JSON 형태의 String으로 저장됩니다.
* 내 파일 목록
  - 로그인한 유저로 저장된 파일들의 목록을 볼 수 있습니다.
  - 내 파일 목록에서 파일을 내려받거나 이름을 변경하거나 삭제할 수 있습니다.


<br/>
> # 동작 방식

### 로그인 시나리오

![java_diagram_login](http://i.imgur.com/JhMo6FN.png)

<br/>
### 도형 그리기 기능 시나리오

![java_diagram_draw_1](http://i.imgur.com/Bas3ekw.png)

<br/>
### 채우기(그라데이션) 기능 시나리오

![java_diagram_draw_2](http://i.imgur.com/F6HVwMz.png)

<br/>
### 파일 저장 기능 시나리오

![java_diagram_file_1](http://i.imgur.com/q7jpjcl.png)

<br/>
### 파일 목록 보기 기능 시나리오

![java_diagram_file_2](http://i.imgur.com/f4l6pmA.png)

<br/>
> # 버전 관리

- 프로젝트의 버전 관리는 해당 페이지의 GitHub를 이용하고 있습니다.
- URL :
  [Web Drawing Project - https://github.com/BangSangEun/bDrawingBoard](https://github.com/BangSangEun/bDrawingBoard)

