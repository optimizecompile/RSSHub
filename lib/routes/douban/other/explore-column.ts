import got from '@/utils/got';
import { load } from 'cheerio';
const url = require('url');

const host = 'https://www.douban.com/explore/column/';
export default async (ctx) => {
    const id = ctx.req.param('id');
    const link = url.resolve(host, id);
    const response = await got.get(link);
    const $ = load(response.data);
    const title = $('div.h1').text();

    const list = $('div.item')
        .slice(0, 10)
        .map(function () {
            const info = {
                title: $(this).find('div.title a').text(),
                link: $(this).find('div.title a').attr('href'),
                author: $(this).find('div.usr-pic a').text(),
            };
            return info;
        })
        .get();

    for (let i = list.length - 1; i >= 0; i--) {
        if (list[i].author === '[已注销]') {
            list.splice(i, 1);
        }
    }

    const out = await Promise.all(
        list.map(async (info) => {
            const title = info.title;
            const author = info.author;
            const itemUrl = info.link;

            const response = await got.get(itemUrl);
            const $ = load(response.data);
            const description = $('#link-report').html();

            const single = {
                title,
                link: itemUrl,
                description,
                author,
            };
            return single;
        })
    );

    ctx.set('data', {
        title: `${title}-豆瓣发现`,
        link,
        item: out,
    });
};
