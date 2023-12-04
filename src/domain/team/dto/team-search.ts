export enum SortOptionForSearch {
    HIGHTEST_TEAM_MEMBERS = 'HIGHTEST_TEAM_MEMBERS',
    LOWEST_TEAM_MEMBERS = 'LOWEST_TEAM_MEMBERS',
    DEFAULT = 'DEFAULT',
}

export enum TeamStatusForSearch {
    DEFAULT = 'ALL',
    GENERAL = 'GENERAL',
    STOPPED = 'STOPPED',
    NOT_EXPOSED = 'NOT_EXPOSED',
    WAITING_FOR_ACTIVITY = 'WAITING_FOR_ACTIVITY',
    DELETED = 'DELETED',
}

export enum SearchCategoryForSearch {
    DEFAULT = 'ALL',
    TEAM_CODE = 'TEAM_CODE',
    TEAM_NAME = 'TEAM_NAME',
    TEAM_LEADER = 'TEAM_LEADER',
}
