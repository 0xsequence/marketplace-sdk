'use client';

import type React from 'react';
import type { ComponentProps } from 'react';

import {
	Box,
	Button,
	CloseIcon,
	IconButton,
	Spinner,
	Text,
} from '@0xsequence/design-system';
import type { Observable } from '@legendapp/state';
import { observer } from '@legendapp/state/react';
import { Close, Content, Overlay, Portal, Root } from '@radix-ui/react-dialog';
import { getProviderEl } from '../../../../../_internal';
import type { ActionModalState } from './store';
import {
	closeButton,
	cta as ctaStyle,
	dialogContent,
	dialogOverlay,
} from './styles.css';

export interface ActionModalProps {
	store: Observable<ActionModalState>;
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
}

export const ActionModal = observer(
	({ store, onClose, title, children, ctas }: ActionModalProps) => {
		return (
			<Root open={store.isOpen.get()}>
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
												disabled={cta.disabled}
												size="lg"
												width="full"
												label={cta.pending ? <Spinner /> : cta.label}
											/>
										),
								)}
							</Box>
						</Box>
						<Close className={closeButton} asChild onClick={onClose}>
							<IconButton size="xs" aria-label="Close modal" icon={CloseIcon} />
						</Close>
					</Content>
				</Portal>
			</Root>
		);
	},
);
