let superagent = require('superagent'),
    cheerio = require('cheerio'),
    async = require('async'),
    http = require('http'),
    fs = require('fs');


require('superagent-charset')(superagent);
require('superagent-proxy')(superagent)

function getProxyUrl(proxyUrl, charset) {
    fs.writeFile('proxy.txt', '', function(err){
        if(err)
            console.error(err);
    })
    superagent
        .get(proxyUrl)
        .charset(charset)
        .set('user-agent', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.62 Safari/537.36')
        .set('authority', 'http://www.xicidaili.com/')
        .set('accept-language', 'zh-CN,zh;q=0.9')
        .end(async (err, res) => {
            if (!err) {
                let $ = cheerio.load(res.text);
                let td = $('html').find('td').next();
                for (let i = 1; i < td.length; i = i + 10) {
                    let proxyIP = $('html').find('td').eq(i).toString().substr(4, $('html').find('td').eq(i).toString().length - 9);
                    let proxyPort = $('html').find('td').eq(i + 1).toString().substr(4, $('html').find('td').eq(i + 1).toString().length - 9);
                    //console.log(proxyIP, proxyPort)
                    await  checkProxy(proxyIP, proxyPort);
                }
            } else {
                console.log(err);
            }
        });
}

function checkProxy(proxyIP, proxyPort) {
    return new Promise(resolve=>{
        let proxy = process.env.http_proxy || 'http://' + proxyIP + ':' + proxyPort;
        superagent
            .get(process.argv[2] || 'http://www.example.com')
            .charset('utf-8')
            .proxy(proxy)
            .set('user-agent', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.62 Safari/537.36')
            .set('authority', 'http://www.xicidaili.com/')
            .set('accept-language', 'zh-CN,zh;q=0.9')
            .end(async (err, res) => {
                if (!err) {
                    let status = res.statusCode;
                    if(status == 200)
                        await postWjx(proxyIP, proxyPort);
                } else {
                    console.log(err);
                }
            })
        resolve();
    })
}

function writefile(proxyIP,proxyPort){
    return new Promise(resolve => {
        console.log(proxyIP, proxyPort);
        fs.appendFile('proxy.txt', proxyIP + ',' + proxyPort + '\r', function(err){
            if(err)
                console.error(err);
        });
    })
}

function postWjx(proxyIP,proxyPort){
    let proxy = process.env.http_proxy || 'http://' + proxyIP + ':' + proxyPort;
    superagent
        .post(process.argv[2] || 'http://www.wjx.cn/joinnew/processjq.ashx?submittype=1&curID=25825060&t=1532220639141&starttime=2018%2F7%2F22%208%3A49%3A35&rn=3525873652.10595540')
        .charset('utf-8')
        .proxy(proxy)
        .set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.62 Safari/537.36')
        .set('Accept', '*/*')
        .set('Accept-Language', 'zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2')
        .set('Accept-Encoding', 'gzip,deflate,br')
        .set('Referer', 'https://www.wjx.cn/jq/25825060.aspx')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Content-Length', '107')
        .set('Cookie', 'ASPXANONYMOUS=VaU6s-dX1AEkAAAAYjY1Mjc3YjItNDQ2YS00NTdhLTkxN2MtNjExNjc4MjI5ZTQ4r0IrjLFM8TcpSPz02FlhJEovexw1; jac25825060=10595540; UM_distinctid=164bf769de272-069863c3a9f1c5-4c312b7b-144000-164bf769de32e9; CNZZDATA4478442=cnzz_eid%3D215755970-1532218241-%26ntime%3D1532218241; Hm_lvt_21be24c80829bd7a683b2c536fcf520b=1532220583; Hm_lpvt_21be24c80829bd7a683b2c536fcf520b=1532220583')
        .set('Connection', 'keep-alive')
        .send(
            'submitdata=1%242%7D2%243%7D3%241%7D4%243%7D5%241%7D6%244%7D7%242%7D8%241%7D9%243%7D10%242%7D11%244%7D12%244'
        )
        .end(async (err, res) => {
            if (!err) {
                let status = res.statusCode;
                console.log(status);
            } else {
                console.log(err);
            }
        })
}
getProxyUrl('http://www.xicidaili.com/nn/', 'utf-8')
//getProxyUrl('http://www.xicidaili.com/nt/', 'utf-8')
//postWjx('61.135.217.7','80');