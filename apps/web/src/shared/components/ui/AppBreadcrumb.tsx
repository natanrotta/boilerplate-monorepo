import { Fragment } from "react";
import { Breadcrumb } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FiChevronRight } from "@/shared/components/icons";

export interface BreadcrumbEntry {
  label: string;
  href?: string;
  isCurrentPage?: boolean;
}

interface AppBreadcrumbProps extends Breadcrumb.RootProps {
  items: BreadcrumbEntry[];
}

export function AppBreadcrumb({ items, ...props }: AppBreadcrumbProps) {
  return (
    <Breadcrumb.Root
      fontSize={{ base: "xs", md: "sm" }}
      color="text.secondary"
      overflowX="auto"
      whiteSpace="nowrap"
      css={{
        "&::-webkit-scrollbar": { display: "none" },
        scrollbarWidth: "none",
        // The separator wrapper's text strut lifts the chevron above the
        // label. Flex-center the icon and zero the line-height to drop the
        // strut, so it sits on the label's midline.
        "& [data-scope='breadcrumb'][data-part='separator']": {
          display: "flex",
          alignItems: "center",
          lineHeight: 0,
        },
      }}
      {...props}
    >
      <Breadcrumb.List>
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <Fragment key={`${item.label}_${item.href ?? "current"}`}>
              <Breadcrumb.Item>
                {item.href ? (
                  <Breadcrumb.Link asChild color="text.secondary">
                    <RouterLink to={item.href}>{item.label}</RouterLink>
                  </Breadcrumb.Link>
                ) : (
                  <Breadcrumb.CurrentLink color="text.primary" fontWeight="600">
                    {item.label}
                  </Breadcrumb.CurrentLink>
                )}
              </Breadcrumb.Item>
              {!last && (
                <Breadcrumb.Separator>
                  <FiChevronRight size={14} />
                </Breadcrumb.Separator>
              )}
            </Fragment>
          );
        })}
      </Breadcrumb.List>
    </Breadcrumb.Root>
  );
}
