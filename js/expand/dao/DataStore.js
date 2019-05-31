import {AsyncStorage} from 'react-native'
import Trending from 'GitHubTrending'
export const FLAG_STORAGE = {flag_popular: 'popular', flag_trending: 'trending'};

export default class DataStore {

    /**
     * 获取数据，优先获取本地数据，瑞国无本地数据或者本地数据过期则获取网络数据
     * @param url
     * @returns {never|*}
     */
    fetchData(url, flag) {
        return new Promise((resolve, reject) => {
            this.fetchLocalData(url).then((wrapData) => {// 获取本地 数据
                if (wrapData && DataStore.checkTimestampValid(wrapData.timestamp)) { // 检查时间有效性
                    resolve(wrapData);
                } else {// 从网络获取数据
                    this.fetchNetData(url, flag).then((data) => {
                        resolve(this._wrapData(data));
                    }).catch((error) => {
                        reject(error)
                    })
                }
            }).catch((error) => { // 获取本地数据出错，去获取网络数据
                this.fetchNetData(url, flag).then((data) => {
                    resolve(this._wrapData(data));
                }).catch((error => {
                    reject(error)
                }))
            })
        });
    }
    /**
     * 保存数据
     */
    saveData(url, data, callback) {
        if (!data || !url) return ;
        AsyncStorage.setItem(url, JSON.stringify(this._wrapData(data)), callback)
    }
    // 获取时间戳，手机当前的时间
    _wrapData(data) {
        return {data: data, timestamp: new Date().getTime()}
    }

    /**
     * 获取本地数据
     * @param url
     * @returns {Promise<any> | Promise<*>}
     */
    fetchLocalData(url) {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(url, (error, result)=>{
                if (!error) {// 没有报错
                    try {
                        resolve(JSON.parse(result));// 解析JSON 数据
                    } catch (e) {// JSON 数据解析出错
                        reject(e);
                        console.error(e);
                    }
                } else {
                    reject(error);
                    console.error(error)
                }
            })
        })
    }

    /**
     * 获取网络数据
     * @param url
     */
    fetchNetData(url, flag) {
        if (flag!== FLAG_STORAGE.flag_trending) {
            return new Promise((resolve, reject) => {
                fetch(url)
                    .then((response) => {
                        if (response.ok) {
                            return response.json();// 获取response中json数据
                        }
                        throw new Error('Network response was no ok')
                    })
                    .then((responseData) => {// 收到 json 会回调
                        this.saveData(url, responseData);// 保存本地
                        resolve(responseData)// 返回这个数据
                    })
                    .catch((error) => {// 捕捉异常
                        reject(error);
                    })
            })
        } else {
            new Trending().fetchTrending(url)
                .then(items => {
                    if (!items) {
                        throw new Error("responseData is null");
                    }
                    this.saveData(url, items);
                    resolve(items);
                })
                .catch(error=>{
                    reject(error)
                })
        }

    }


    /**
     * 检查timestamp是否在有效期内
     * @param timestamp 项目更新时间
     * @return {boolean} true 不需要更新,false需要更新
     */
    static checkTimestampValid(timestamp) {
        const currentDate = new Date();
        const targetDate = new Date();
        targetDate.setTime(timestamp);
        if (currentDate.getMonth() !== targetDate.getMonth()) return false;
        if (currentDate.getDate() !== targetDate.getDate()) return false;
        if (currentDate.getHours() - targetDate.getHours() > 4) return false;//有效期4个小时
        // if (currentDate.getMinutes() - targetDate.getMinutes() > 1)return false;
        return true;
    }
}