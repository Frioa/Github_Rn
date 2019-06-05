import {onThemeChange, onShowCustomThemeView, onThemeInit} from './theme'
import {onLoadPopularData, onLoadMorePopular, onFlushPopularFavorite} from './popular'
import {onLoadMoreTrending, onLoadTrendingData, onFlushTrendingFavorite} from './trending'
import {onLoadFavoriteData,} from './favorite'
import {onLoadLanguage,} from './language'
// 其他地方需要使用，只需要导入这个index
export default {
    onThemeChange,
    onShowCustomThemeView,
    onThemeInit,
    onLoadPopularData,
    onLoadMorePopular,
    onLoadMoreTrending,
    onLoadTrendingData,
    onLoadFavoriteData,
    onFlushPopularFavorite,
    onFlushTrendingFavorite,
    onLoadLanguage,
}