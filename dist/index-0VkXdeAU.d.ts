import { GetOrdersInput, GetOrdersReturn, Page, SdkConfig, ValuesOptional } from "./create-config-CsagtMvq.js";
import { StandardQueryOptions } from "./query-brXxOcH0.js";
import * as _tanstack_react_query272 from "@tanstack/react-query";

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
declare function ordersQueryOptions(params: OrdersQueryOptions): _tanstack_react_query272.OmitKeyof<_tanstack_react_query272.UseQueryOptions<GetOrdersReturn, Error, GetOrdersReturn, (string | OrdersQueryOptions)[]>, "queryFn"> & {
  queryFn?: _tanstack_react_query272.QueryFunction<GetOrdersReturn, (string | OrdersQueryOptions)[], never> | undefined;
} & {
  queryKey: (string | OrdersQueryOptions)[] & {
    [dataTagSymbol]: GetOrdersReturn;
    [dataTagErrorSymbol]: Error;
  };
};
//#endregion
export { FetchOrdersParams, OrdersQueryOptions, fetchOrders as fetchOrders$1, ordersQueryOptions as ordersQueryOptions$1 };
//# sourceMappingURL=index-0VkXdeAU.d.ts.map