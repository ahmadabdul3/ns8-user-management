export class RouteResponse {
  status: string;
  message: string;
  friendlyMessage: string;
  data: any;
  error: any;

  constructor(
    status: string,
    message: string,
    friendlyMessage: string,
    data: any,
    error: any
  ) {
    this.status = status;
    this.message = message;
    this.friendlyMessage = friendlyMessage;
    this.data = data;
    this.error = error;
  }
}

export class RouteResponseSuccess extends RouteResponse {
  static default(data: any) {
    return new this('Success', 'Successful API request', data);
  }

  constructor(message: string, friendlyMessage: string, data: any) {
    super('Success', message, friendlyMessage, data, {});
  }
}

export class RouteResponseError extends RouteResponse {
  static default(error: any) {
    return new this('Error', 'Failed API request', error);
  }

  constructor(message: string, friendlyMessage: string, error: any) {
    super('Error', message, friendlyMessage, {}, error);
  }
}
