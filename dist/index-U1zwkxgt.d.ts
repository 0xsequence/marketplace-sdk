import { $ as SdkConfig, _r as GetOrdersReturn, gr as GetOrdersInput, mi as Page, z as ValuesOptional } from "./create-config-BA_ne-vj.js";
import { n as StandardQueryOptions } from "./query-C2OTGyRy.js";
import * as _tanstack_react_query0 from "@tanstack/react-query";

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
declare function ordersQueryOptions(params: OrdersQueryOptions): _tanstack_react_query0.OmitKeyof<_tanstack_react_query0.UseQueryOptions<GetOrdersReturn, Error, GetOrdersReturn, (string | OrdersQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query0.QueryFunction<GetOrdersReturn, (string | OrdersQueryOptions)[], never> | undefined;
} & {
  queryKey: (string | OrdersQueryOptions)[] & {
    [dataTagSymbol]: GetOrdersReturn;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { ordersQueryOptions as i, OrdersQueryOptions as n, fetchOrders as r, FetchOrdersParams as t };
//# sourceMappingURL=index-U1zwkxgt.d.ts.map