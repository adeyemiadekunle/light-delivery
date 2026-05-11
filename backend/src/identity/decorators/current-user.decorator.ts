import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CurrentUser } from '../current-user.type';

type RequestWithUser = {
  user?: CurrentUser;
};

export const CurrentUserContext = createParamDecorator(
  (property: keyof CurrentUser | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    return property && user ? user[property] : user;
  },
);
