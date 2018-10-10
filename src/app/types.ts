export class User {
  username: string;
  fullname: string;
}

export class UserData {
  total: number;
  total_len: number;
  avg_len: number;
  stdev_len: number;
  avg_sent: number;
  stdev_sent: number;
}

export class APIResponse {
  status: string;
  message: string;
}

export class APIUserListResponse extends APIResponse {
  users: User[];
}

export class APIAnalyzeResponse extends APIResponse {
  count: number;
}

export class APIGeneratedTweetsResponse extends APIResponse {
  tweets: string[];
}

export class APIProbabilityReport extends APIResponse {
  probability: number;
  next_word: number;
}

export class APIAllTimeAnalysis extends APIResponse {
  data: UserData;
}

export class APIPointAnalysis extends APIResponse {
  data: UserData[];
}

export class APIHourlyDailyAnalysis extends APIResponse {
  data: UserData[][];
}
