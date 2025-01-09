import { Show, observer } from '@legendapp/state/react';
import type { QueryKey } from '@tanstack/react-query';
import { parseUnits } from 'viem';
import {
  type Order,
  balanceQueries,
  collectableKeys,
} from '../../../_internal';
import { useCollection, useCurrencies } from '../../../hooks';
import { useSell } from '../../../hooks/useSell';
import { ErrorModal } from '../_internal/components/actionModal/ErrorModal';
import {
  ActionModal,
  type ActionModalProps,
} from '../_internal/components/actionModal/ActionModal';
import { LoadingModal } from '../_internal/components/actionModal/LoadingModal';
import TokenPreview from '../_internal/components/tokenPreview';
import TransactionDetails from '../_internal/components/transactionDetails';
import TransactionHeader from '../_internal/components/transactionHeader';
import { useTransactionStatusModal } from '../_internal/components/transactionStatusModal';
import { sellModal$ } from './_store';
import { TransactionType } from '../../../_internal/transaction-machine/execute-transaction';
import { useCurrencyOptions } from '../../../hooks/useCurrencyOptions';
import { useEffect, useState } from 'react';
import type { MarketplaceKind } from '../../../_internal/api/marketplace.gen';

type TransactionStatusModalReturn = ReturnType<
  typeof useTransactionStatusModal
>;

export const SellModal = () => {
  const { show: showTransactionStatusModal } = useTransactionStatusModal();
  return (
    <Show if={sellModal$.isOpen}>
      {() => <Modal showTransactionStatusModal={showTransactionStatusModal} />}
    </Show>
  );
};

const Modal = observer(
  ({
    showTransactionStatusModal,
  }: {
    showTransactionStatusModal: TransactionStatusModalReturn['show'];
  }) => {
