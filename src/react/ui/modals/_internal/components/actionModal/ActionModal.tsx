'use client';

import type React from 'react';
import type { ComponentProps } from 'react';

import type { ActionModalState } from './store';
import {
	dialogOverlay,
	dialogContent,
	closeButton,
	cta as ctaStyle,
	ctaWrapper,
} from './styles.css';
import {
	Box,
	IconButton,
	CloseIcon,
	Text,
	Button,
} from '@0xsequence/design-system';
import type { Observable } from '@legendapp/state';
import { observer } from '@legendapp/state/react';
import { Root, Portal, Overlay, Content, Close } from '@radix-ui/react-dialog';

export interface ActionModalProps {
	store: Observable<ActionModalState>;
	onClose: () => void;
	title: string;
	children: React.ReactNode;
	ctas: {
		label: string;
		onClick: () => Promise<void>;
		variant?: ComponentProps<typeof Button>['variant'];
	}[];
}

export const ActionModal = observer(
	({ store, onClose, title, children, ctas }: ActionModalProps) => {
		return (
			<Root open={store.isOpen.get()}>
				<Portal>
					<Overlay className={dialogOverlay} />
					<Content className={dialogContent}>
						<Box
							display="flex"
							flexGrow={'1'}
							alignItems="center"
							flexDirection="column"
							position={'relative'}
						>
							<Text
								fontSize="medium"
								fontWeight="bold"
								textAlign="center"
								width="full"
								color="text100"
							>
								{title}
							</Text>
							{children}

							<Box className={ctaWrapper}>
								<Box
									width="full"
									position="absolute"
									bottom="0"
									flexDirection="column"
									gap="2"
								>
									{ctas.map((cta, index) => (
										<Button
											key={index}
											className={ctaStyle}
											onClick={cta.onClick}
											variant={cta.variant || 'primary'}
											size="lg"
											width="full"
											label={cta.label}
										/>
									))}
								</Box>
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
