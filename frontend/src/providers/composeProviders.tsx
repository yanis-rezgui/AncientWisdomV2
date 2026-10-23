
import {
    Children,
    type ComponentType,
    type PropsWithChildren,
} from "react";

type Provider = ComponentType<PropsWithChildren>;

interface ComposeProvidersProps extends PropsWithChildren {
    providers: Provider[];
}

export default function ComposeProviders({
    providers,
    children,
}: ComposeProvidersProps) {
    return providers.reduceRight(
        (content, Provider) => (
            <Provider>{content}</Provider>
        ),
        Children.toArray(children) as React.ReactNode,
    );
}
