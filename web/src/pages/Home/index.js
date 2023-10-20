import React, { useContext, useEffect, useState } from 'react';
import { Card, Grid, Header, Segment } from 'semantic-ui-react';
import { API, showError, showNotice, timestamp2string } from '../../helpers';
import { StatusContext } from '../../context/Status';
import { marked } from 'marked';

const Home = () => {
    const [statusState, statusDispatch] = useContext(StatusContext);
    const [homePageContentLoaded, setHomePageContentLoaded] = useState(false);
    const [homePageContent, setHomePageContent] = useState('');

    const displayNotice = async () => {
        const res = await API.get('/api/notice');
        const { success, message, data } = res.data;
        if (success) {
            let oldNotice = localStorage.getItem('notice');
            if (data !== oldNotice && data !== '') {
                const htmlNotice = marked(data);
                showNotice(htmlNotice, true);
                localStorage.setItem('notice', data);
            }
        } else {
            showError(message);
        }
    };

    const displayHomePageContent = async () => {
        setHomePageContent(localStorage.getItem('home_page_content') || '');
        const res = await API.get('/api/home_page_content');
        const { success, message, data } = res.data;
        if (success) {
            let content = data;
            if (!data.startsWith('https://')) {
                content = marked.parse(data);
            }
            setHomePageContent(content);
            localStorage.setItem('home_page_content', content);
        } else {
            showError(message);
            setHomePageContent('加载首页内容失败...');
        }
        setHomePageContentLoaded(true);
    };

    const getStartTimeString = () => {
        const timestamp = statusState?.status?.start_time;
        return timestamp2string(timestamp);
    };

    useEffect(() => {
        displayNotice().then();
        displayHomePageContent().then();
    }, []);
    return (
        <>
            {
                homePageContentLoaded && homePageContent === '' ? <>
                    <Segment>
                        <div style="font-size: larger;"><h2 id="💰-定制价格策略">💰 定制价格策略</h2>
                            <h3 id="📉-超低价-gpt-35·0.1比1">📉 超低价 GPT-3.5·0.1比1</h3>
                            <p>无论是个人使用还是团队研究，这份超值报价让你无法抵挡！</p>
                            <h3 id="✨官方-gpt-4·-1比1">✨官方 GPT-4· 1比1</h3>
                            <p>虽然价格稍微有些偏高，但品质绝对匹敌官网提供——最大限度确保您业务顺利进行!</p>
                            <h3 id="📉-普通-gpt-35·0.25比1">📉 普通-gpt-35·0.25比1 见 https://api3.a1r.cc</h3>
                        </div>
                    </Segment>
                </> : <>
                    {
                        homePageContent.startsWith('https://') ? <iframe
                            src={homePageContent}
                            style={{ width: '100%', height: '100vh', border: 'none' }}
                        /> : <div style={{ fontSize: 'larger' }} dangerouslySetInnerHTML={{ __html: homePageContent }}></div>
                    }
                </>
            }

        </>
    );
};

export default Home;