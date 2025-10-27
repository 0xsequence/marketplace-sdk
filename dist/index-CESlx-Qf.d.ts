import { $ as SdkConfig, _r as GetOrdersReturn, gr as GetOrdersInput, mi as Page, z as ValuesOptional } from "./create-config-DMM2szLh.js";
import { n as StandardQueryOptions } from "./query-D8sokOq-.js";
import * as _tanstack_react_query12 from "@tanstack/react-query";

//#region src/react/queries/orders.d.ts
interface FetchOrdersParams {
  chainId: number;
  input: GetOrdersInput[];
  page?: Page;
  config: SdkConfig;
}
/**
 * Fetches orders from the marketplace API
 */
declare function fetchOrders(params: FetchOrdersParams): Promise<GetOrdersReturn>;
type OrdersQueryOptions = ValuesOptional<FetchOrdersParams> & {
  query?: StandardQueryOptions;
};
declare function ordersQueryOptions(params: OrdersQueryOptions): _tanstack_react_query12.OmitKeyof<_tanstack_react_query12.UseQueryOptions<GetOrdersReturn, Error, GetOrdersReturn, (string | OrdersQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query12.QueryFunction<GetOrdersReturn, (string | OrdersQueryOptions)[], never> | undefined;
} & {
  queryKey: (string | OrdersQueryOptions)[] & {
    [dataTagSymbol]: GetOrdersReturn;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { ordersQueryOptions as i, OrdersQueryOptions as n, fetchOrders as r, FetchOrdersParams as t };
//# sourceMappingURL=index-CESlx-Qf.d.ts.map