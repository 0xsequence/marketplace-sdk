'use client';

import type React from 'react';
import { useState, type ComponentProps } from 'react';

import {
	Box,
	Button,
	CloseIcon,
	IconButton,
	Spinner,
	Text,
} from '@0xsequence/design-system';
import { observer } from '@legendapp/state/react';
import { Close, Content, Overlay, Portal, Root } from '@radix-ui/react-dialog';
import { getProviderEl } from '../../../../../_internal';
import {
	closeButton,
	cta as ctaStyle,
	dialogContent,
	dialogOverlay,
} from './styles.css';
import WaasFeeOptionsBox from '../waasFeeOptionsBox';

export interface ActionModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: React.ReactNode;
	ctas: {
		label: string;
		onClick: (() => Promise<void>) | (() => void);
		pending?: boolean;
		disabled?: boolean;
		hidden?: boolean;
		variant?: ComponentProps<typeof Button>['variant'];
	}[];
	chainId: number;
}

export const ActionModal = observer(
	({ isOpen, onClose, title, children, ctas, chainId }: ActionModalProps) => {
		const [isSelectingFees, setIsSelectingFees] = useState(false);

		return (
			<Root open={isOpen && !!chainId}>
				<Portal container={getProviderEl()}>
					<Overlay className={dialogOverlay} />
					<Content className={dialogContent.narrow}>
						<Box
							display="flex"
							flexGrow={'1'}
							alignItems="center"
							flexDirection="column"
							gap="4"
							position={'relative'}
						>
							<Text
								fontSize="medium"
								fontWeight="bold"
								textAlign="center"
								width="full"
								color="text100"
								fontFamily="body"
							>
								{title}
							</Text>

							{children}

							<Box width="full" display="flex" flexDirection="column" gap="2">
								{ctas.map(
									(cta) =>
										!cta.hidden && (
											<Button
												key={cta.label}
												className={ctaStyle}
												onClick={async () => {
													await cta.onClick();
												}}
												variant={cta.variant || 'primary'}
												pending={cta.pending}
												disabled={cta.disabled || isSelectingFees}
												size="lg"
												width="full"
												label={isSelectingFees ? <Spinner /> : cta.label}
											/>
										),
								)}
							</Box>
						</Box>

						<WaasFeeOptionsBox
							chainId={chainId}
							onFeeOptionsLoaded={() => setIsSelectingFees(true)}
							onFeeOptionConfirmed={() => setIsSelectingFees(false)}
						/>

						<Close className={closeButton} asChild onClick={onClose}>
							<IconButton size="xs" aria-label="Close modal" icon={CloseIcon} />
						</Close>
					</Content>
				</Portal>
			</Root>
		);
	},
);
