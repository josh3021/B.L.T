import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div>
            <h2>
                홈
            </h2>
            <div>
                <Link to={'/statics'}>통계 페이지</Link>
            </div>
            <div>
                <a href="/main">메인 페이지</a>
            </div>
            <div>
                <a href="/profile">프로필 페이지</a>
            </div>
            <div>
                <a href="/logout">로그아웃</a>
            </div>
            <div>
                <a href="/signup">회원가입</a>
            </div>
        </div>
    );
};

export default Home;