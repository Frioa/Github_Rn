import {onThemeChange} from './theme'
import {onLoadPopularData, onLoadMorePopular} from './popular'
import {onLoadMoreTrending, onLoadTrendingData} from './trending'
import {onLoadFavoriteData,} from './favorite'
// 其他地方需要使用，只需要导入这个index
export default {
    onThemeChange,
    onLoadPopularData,
    onLoadMorePopular,
    onLoadMoreTrending,
    onLoadTrendingData,
    onLoadFavoriteData,
}