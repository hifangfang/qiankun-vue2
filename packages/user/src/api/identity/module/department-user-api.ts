import MICRO_CONFIG from '../../platform_config';
import { DepartUsersTreeAllVo } from "@/api/identity/model/department-user-model"
import axios from "axios";
import {ApiResponse} from "@/api/api-response";
export class DepartmentUserApi {

  /**
   * 获取用户树
   * GET
   */
  static syncDepartmentsUserTreeGET = MICRO_CONFIG.identity + '/department-user/sync-departments-user-tree/{parentid}/{username}/{status}';

  /**
   *
   */

}
