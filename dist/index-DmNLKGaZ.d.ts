import { $ as SdkConfig, _r as GetOrdersReturn, gr as GetOrdersInput, mi as Page, z as ValuesOptional } from "./create-config-l2-8j3NB.js";
import { n as StandardQueryOptions } from "./query-D8sokOq-.js";
import * as _tanstack_react_query61 from "@tanstack/react-query";

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
declare function ordersQueryOptions(params: OrdersQueryOptions): _tanstack_react_query61.OmitKeyof<_tanstack_react_query61.UseQueryOptions<GetOrdersReturn, Error, GetOrdersReturn, (string | OrdersQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query61.QueryFunction<GetOrdersReturn, (string | OrdersQueryOptions)[], never> | undefined;
} & {
  queryKey: (string | OrdersQueryOptions)[] & {
    [dataTagSymbol]: GetOrdersReturn;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { ordersQueryOptions as i, OrdersQueryOptions as n, fetchOrders as r, FetchOrdersParams as t };
//# sourceMappingURL=index-DmNLKGaZ.d.ts.map