#project-overview
스타일 공유 및 큐레이팅 서비스 데이터 베이느는 몽고 DB를 사용합니다

#feature-requirements

1. React, express, 몽고 DB를 사용합니다

2.기능 요구 사항들

**스타일 등록**

- 유저가 사진(여러장 가능)을 업로드하고 태그(최대 3개), 제목, 닉네임, 스타일 구성, 스타일 설명, 비밀번호를 입력하여 스타일을 등록합니다.
- 스타일 구성의 종류에는 **상의, 하의, 아우터, 원피스, 신발, 가방, 패션잡화**가 있으며, 각 구성마다 의상명, 브랜드명, 가격을 입력할 수 있습니다.

**스타일 수정**

- 비밀번호를 입력하여 스타일 등록 시 입력했던 비밀번호와 일치할 경우 스타일 수정이 가능합니다.

**스타일 삭제**

- 비밀번호를 입력하여 스타일 등록 시 입력했던 비밀번호와 일치할 경우 스타일 삭제가 가능합니다.

**스타일 목록 조회**

- 갤러리
    - 등록된 스타일 목록을 조회할 수 있습니다.
    - 각 스타일의 대표 이미지, 제목, 닉네임, 태그, 스타일 구성, 스타일 설명, 조회수, 큐레이팅 수가 표시됩니다.
    - 갤러리 상단에 인기 태그가 표시됩니다. 해당 태그를 클릭하면 그 태그에 해당하는 스타일 목록이 표시됩니다.
    - 페이지네이션이 가능합니다.
    - 최신순, 조회순, 큐레이팅순(큐레이팅 많은 순)으로 정렬 가능합니다.
    - 닉네임, 제목, 상세, 태그로 검색이 가능합니다.
- 랭킹
    - 전체, 트렌디, 개성, 실용성, 가성비 기준으로 스타일 랭킹 목록을 조회할 수 있습니다.
    - 각 스타일의 대표 이미지, 제목, 닉네임, 태그, 스타일 구성, 조회수, 큐레이팅수가 표시됩니다.
    - 페이지네이션이 가능합니다.

**스타일 상세 조회**

- 갤러리, 랭킹에서 스타일을 클릭할 경우 스타일 상세 조회가 가능합니다.
- 이미지(여러장 가능), 제목, 닉네임, 태그, 스타일 구성, 스타일 설명, 조회수, 큐레이팅수가 표시됩니다.
- 해당 스타일의 큐레이팅 목록이 표시됩니다.

### 큐레이팅

**큐레이팅 등록**

- 트렌디, 개성, 실용성, 가성비 점수와 한줄 큐레이팅, 닉네임, 비밀번호를 입력하여 큐레이팅을 등록합니다.

**큐레이팅 수정**

- 비밀번호를 입력하여 큐레이팅 등록 시 입력했던 비밀번호와 일치할 경우 큐레이팅 수정이 가능합니다.

**큐레이팅 삭제**

- 비밀번호를 입력하여 큐레이팅 등록 시 입력했던 비밀번호와 일치할 경우 큐레이팅 삭제가 가능합니다.

**큐레이팅 목록 조회**

- 스타일을 조회할 경우 그 스타일에 해당되는 큐레이팅 목록이 같이 조회됩니다.
- 각 큐레이팅의 트렌디, 개성, 실용성, 가성비 점수와 한줄 큐레이팅, 닉네임이 표시됩니다.
- 닉네임, 내용으로 검색이 가능합니다.
- 큐레이팅에 남겨진 답글도 같이 조회됩니다.

### 답글

**답글 등록**

- 답글 내용과 비밀번호를 입력하여 답글을 등록합니다. 비밀번호가 스타일 등록 시 입력했던 비밀번호와 일치하면 답글이 등록됩니다.
- 답글은 큐레이팅 당 하나만 등록 가능합니다.

**답글 수정**

- 비밀번호를 입력하여 답글 등록 시 입력했던 비밀번호와 일치할 경우 답글 수정이 가능합니다.

**답글 삭제**

- 비밀번호를 입력하여 답글 등록 시 입력했던 비밀번호와 일치할 경우 답글 삭제가 가능합니다.

**답글 목록 조회**

- 큐레이팅을 조회할 경우 그 큐레이팅에 해당되는 답글도 같이 조회됩니다.
- 닉네임, 답글 내용이 표시됩니다.

#current-file-instruction
C:.
├─public
│  ├─fonts
│  └─images
└─src
    ├─app
    │  ├─ranking
    │  ├─styles
    │  │  ├─create
    │  │  └─[styleId]
    │  │      └─edit
    │  └─_meta
    ├─libs
    │  ├─curating
    │  │  ├─data-access-comment
    │  │  ├─data-access-curating
    │  │  ├─feature-comment
    │  │  ├─feature-curating
    │  │  ├─ui-comment
    │  │  └─ui-curating
    │  ├─setting
    │  │  ├─data-access-setting
    │  │  └─feature-setting
    │  ├─shared
    │  │  ├─button
    │  │  ├─dropdown
    │  │  ├─empty-data
    │  │  ├─form-field
    │  │  │  ├─AuthFormContent
    │  │  │  ├─CategoriesField
    │  │  │  └─ImageUploadConnect
    │  │  ├─icon
    │  │  ├─input
    │  │  │  ├─FieldLabel
    │  │  │  ├─Hint
    │  │  │  ├─SearchBar
    │  │  │  ├─TextArea
    │  │  │  └─TextField
    │  │  ├─layout
    │  │  ├─modal
    │  │  │  ├─confirm-modal
    │  │  │  └─form-modal
    │  │  ├─navigation
    │  │  ├─pagination
    │  │  ├─range-slider
    │  │  ├─tag
    │  │  │  ├─tag
    │  │  │  └─temporary-tag
    │  │  ├─util-constants
    │  │  ├─util-hook
    │  │  └─util-util
    │  ├─style
    │  │  ├─data-access-style
    │  │  └─feature-style
    │  ├─style-detail
    │  │  ├─data-access-style-detail
    │  │  ├─feature-style-detail
    │  │  └─ui-style-detail
    │  ├─style-gallery
    │  │  ├─data-access-gallery
    │  │  ├─feature-gallery
    │  │  └─ui-gallery
    │  └─style-ranking
    │      ├─data-access-ranking
    │      ├─feature-ranking
    │      ├─ui-ranking
    │      └─util-constants
    ├─services
    │  └─superstruct
    └─styles
        └─css

#rules
DB 네이밍 속성
id : 고유 아이디
name : 이름
title : 제목
description : 설명
content : 내용
imageUrl : 이미지 주소
thumbnail : 썸네일 이미지 주소
tags : 태그
nickname : 닉네임
viewCount : 조회수
curationCount : 큐레이팅수
categories : 카테고리
createdAt : 생성일

