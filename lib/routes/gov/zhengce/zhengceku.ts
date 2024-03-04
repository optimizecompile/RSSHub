// @ts-nocheck
import buildData from '@/utils/common-config';

export default async (ctx) => {
    const department = ctx.req.param('department');
    const link = `http://www.gov.cn/zhengce/zhengceku/${department}/`;

    ctx.set(
        'data',
        await buildData({
            link,
            url: link,
            title: `%title%`,
            description: '政府文件库, 当页的所有列表',
            params: {
                title: `$('.channel_tab > .noline > a').text().trim() + ' - 政府文件库'`,
            },
            item: {
                item: '.news_box > .list > ul > li:not(.line)',
                title: `$('h4 > a').text()`,
                link: `$('h4 > a').attr('href')`,
                pubDate: `parseDate($('h4 > .date').text().trim())`,
            },
        })
    );
};
