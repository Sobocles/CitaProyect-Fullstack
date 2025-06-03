"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserState = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "ADMIN_ROLE";
    UserRole["USER"] = "USER_ROLE";
    UserRole["MEDICO"] = "MEDICO_ROLE";
})(UserRole || (exports.UserRole = UserRole = {}));
var UserState;
(function (UserState) {
    UserState["ACTIVE"] = "activo";
    UserState["INACTIVE"] = "inactivo";
    UserState["SUSPENDED"] = "suspendido";
})(UserState || (exports.UserState = UserState = {}));
//# sourceMappingURL=enums.js.map