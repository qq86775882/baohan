import requests
import time

import random
import string
headers = {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Pragma': 'no-cache',
    'Referer': 'http://df.n.987qf.xyz/',
    'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.95 Mobile Safari/537.36',
}
def get_siteconfig():
    response = {
    "title": "酷乐网游",
    "config": {
        "yunyingshijian": 12,
        "fuwuyonghu": 30,
        "chengjiaodingdan": 18,
        "zhanghaoshifangurl": "https://m.tb.cn/h.709jJqg8ChfhKTL",
        "dianpuurl": "https://m.tb.cn/h.709jJqg8ChfhKTL",
        "tupianshuiying": "酷乐",
        "topSectionTheme": {
           "background": "linear-gradient(135deg, #1a1a1a 0%, #2d1b0f 50%, #3a2a1a 100%)",
            "overlayBackground": "radial-gradient(circle at 20% 30%, rgba(255, 140, 0, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255, 165, 0, 0.1) 0%, transparent 50%), radial-gradient(circle at 50% 10%, rgba(255, 69, 0, 0.08) 0%, transparent 50%)",
            "accentColor": "linear-gradient(90deg, #ff8c00, #ffd700)",
            "accentColorSecondary": "#ffa500"
        }
    }
}
    return response
def get_hotgamelist():
    response = requests.get('http://df.n.987qf.xyz/api/gethotgamelist.php', headers=headers, verify=False)
    return response.json()
def getudid():
    response = requests.get('http://df.n.987qf.xyz/api/getudid.php', headers=headers, verify=False)
    return response.json()
def reportview(page,udid):
    json_data = {
    'page': page,
    'udid': udid,
    }

    response = requests.post('http://df.n.987qf.xyz/api/reportview.php', headers=headers, json=json_data, verify=False)
    return response.json()
def getgamelist():
    response = requests.get('http://df.n.987qf.xyz/api/getgamelist.php', headers=headers, verify=False)
    return response.json()
def getplatform(gameid):
    response = requests.get(f'http://df.n.987qf.xyz/api/getplatform.php?gameid={gameid}', headers=headers, verify=False)
    return response.json()


# 生成新的REQUESTID
def generate_request_id():
    timestamp = int(time.time() * 1000)
    random_str = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
    return f"{timestamp}-{random_str}"    
def getgoodslistv3(gameid, platformId,platformName,clientId,categoryId,parentId,queryType,page,pageSize,serverId,serverName,sortId,sortPanelName,clientName):
    json_data = {
    'gameId': gameid,
    'platformId': platformId,
    'platformName': platformName,
    'clientId': clientId,
    'categoryId': categoryId,
    'parentId': parentId,
    'queryType': queryType,
    'page': page,
    'pageSize': pageSize,
    'serverId': serverId,
    'serverName': serverName,
    'sortId': sortId,
    'sortPanelName': sortPanelName,
    'clientName': clientName,
    }

    headers1 = {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Content-Type': 'application/json',
    'Origin': 'http://df.n.987qf.xyz',
    'Pragma': 'no-cache',
    'REQUESTID': generate_request_id(),
    'Referer': f'http://df.n.987qf.xyz/game/{gameid}',
    'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.95 Mobile Safari/537.36',
}
    response = requests.post('http://df.n.987qf.xyz/api/getgoodslistv3.php', headers=headers1, json=json_data, verify=False)

    return response.json()
def getshaixuan(gameid, categoryid):
    response = requests.get(f'http://df.n.987qf.xyz/api/getshaixuan.php?gameid={gameid}&categoryid={categoryid}', headers=headers, verify=False)
    return response.json()
def getclientlist(gameid,categoryid):
    response = requests.get(f'http://df.n.987qf.xyz/api/getclientlist.php?gameid={gameid}&categoryid={categoryid}', headers=headers, verify=False)
    return response.json()
def getseverlist(categoryid):
    response = requests.get(f'http://df.n.987qf.xyz/api/getseverlist.php?categoryid={categoryid}', headers=headers, verify=False)
    return response.json()
def gethotsearch(gameid, categoryid, parentId):
    response = requests.get(f'http://df.n.987qf.xyz/api/gethotsearch.php?gameid={gameid}&categoryid={categoryid}&parentId={parentId}&platformid=2', headers=headers, verify=False)
    return response.json()
def getxiangqing(goodid,gameid):
    response = requests.get(f'http://df.n.987qf.xyz/api/getxiangqing.php?goodid={goodid}&gameid={gameid}', headers=headers, verify=False)
    return response.json()
    
