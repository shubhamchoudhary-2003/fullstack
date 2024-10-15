"use client"

// External components
import * as React from "react"
import { useParams, usePathname } from "next/navigation"
import { twJoin } from "tailwind-merge"
import { Popover, Select } from "react-aria-components"
import { HttpTypes } from "@medusajs/types"

// Modules
import LocalizedClientLink from "@modules/common/components/localized-client-link"

// Components
import { Button, Drawer, Icon, Input, Layout, LayoutColumn } from "./"

// Components
import {
  UiSelectButton,
  UiSelectIcon,
  UiSelectListBox,
  UiSelectListBoxItem,
  UiSelectValue,
} from "@/components/ui/Select"
import { updateRegion } from "@lib/data/cart"

export function InnerHeader({ regions }: { regions: HttpTypes.StoreRegion[] }) {
  const pathName = usePathname()
  const { countryCode } = useParams()
  const currentPath = pathName.split(`/${countryCode}`)[1]
  const isPageWithHeroImage =
    !currentPath ||
    currentPath === "/" ||
    currentPath === "/about" ||
    currentPath === "/inspiration" ||
    currentPath === "/collection"

  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  const handleScroll = (elementsToChangeColor: NodeListOf<Element>) => {
    const position = window.scrollY

    position > 200
      ? elementsToChangeColor.forEach((element) => {
          element.setAttribute("data-changecolor", "true")
        })
      : elementsToChangeColor.forEach((element) => {
          element.setAttribute("data-changecolor", "false")
        })
  }

  React.useEffect(() => {
    const elementsToChangeColor = document.querySelectorAll(".js-bg-change")

    window.addEventListener(
      "scroll",
      () => handleScroll(elementsToChangeColor),
      {
        passive: true,
      }
    )

    return () => {
      window.removeEventListener("scroll", () =>
        handleScroll(elementsToChangeColor)
      )
    }
  }, [])

  const countryOptions = React.useMemo(() => {
    return regions
      .map((r) => {
        return (r.countries ?? []).map((c) => ({
          country: c.iso_2,
          region: r.id,
          label: c.display_name,
        }))
      })
      .flat()
      .sort((a, b) => (a?.label ?? "").localeCompare(b?.label ?? ""))
  }, [regions])

  return (
    <div
      className={twJoin(
        "top-0 left-0 w-full max-md:bg-grayscale-50 data-[changecolor=true]:md:bg-white data-[changecolor=true]:md:text-black transition-colors fixed max-md:px-6 z-40 js-bg-change",
        isPageWithHeroImage && "md:text-white"
      )}
      data-changecolor={false}
    >
      <Layout>
        <LayoutColumn>
          <div className="flex justify-between items-center h-18 md:h-21">
            <h1 className="font-medium text-md">
              <LocalizedClientLink href="/">SofaSocietyCo.</LocalizedClientLink>
            </h1>
            <div className="flex items-center gap-8 max-md:hidden">
              <LocalizedClientLink href="/about">About</LocalizedClientLink>
              <LocalizedClientLink href="/inspiration">
                Inspiration
              </LocalizedClientLink>
              <LocalizedClientLink href="/store">Shop</LocalizedClientLink>
            </div>
            <div className="flex items-center gap-3 lg:gap-6 max-md:hidden">
              <Select
                selectedKey={`${countryCode}`}
                onSelectionChange={(key) => {
                  updateRegion(`${key}`, currentPath)
                }}
                className="w-16"
              >
                <UiSelectButton className="bg-transparent border-0 h-auto !gap-0 !p-1 w-full">
                  <UiSelectValue>
                    {(item) =>
                      typeof item.selectedItem === "object" &&
                      item.selectedItem !== null &&
                      "country" in item.selectedItem &&
                      typeof item.selectedItem.country === "string"
                        ? item.selectedItem.country.toUpperCase()
                        : item.defaultChildren
                    }
                  </UiSelectValue>
                  <UiSelectIcon className="text-current" />
                </UiSelectButton>
                <Popover className="max-w-61 w-full">
                  <UiSelectListBox>
                    {countryOptions.map((country) => (
                      <UiSelectListBoxItem
                        key={country.country}
                        id={country.country}
                        value={country}
                      >
                        {country.label}
                      </UiSelectListBoxItem>
                    ))}
                  </UiSelectListBox>
                </Popover>
              </Select>
              <Button
                variant="ghost"
                className={twJoin(
                  "p-1 data-[changecolor=true]:md:text-black js-bg-change",
                  isPageWithHeroImage && "md:text-white"
                )}
                data-changecolor={false}
              >
                <Icon name="search" className="w-5 h-5" />
              </Button>
              {/* <Button
                variant="ghost"
                className={twJoin(
                  "p-1",
                  isPageWithHeroImage && "md:text-white"
                )}
              >
                <Icon name="user" className="w-6 h-6" />
              </Button> */}
              <LocalizedClientLink href="/cart">
                <Button
                  variant="ghost"
                  className={twJoin(
                    "p-1 data-[changecolor=true]:md:text-black js-bg-change",
                    isPageWithHeroImage && "md:text-white"
                  )}
                  data-changecolor={false}
                >
                  <Icon name="case" className="w-6 h-6" />
                </Button>
              </LocalizedClientLink>
            </div>
            <div className="flex items-center gap-6 md:hidden">
              <LocalizedClientLink href="/cart">
                <Button
                  variant="ghost"
                  className={twJoin(
                    "p-1",
                    isPageWithHeroImage && "md:text-white"
                  )}
                >
                  <Icon name="case" className="w-6 h-6" />
                </Button>
              </LocalizedClientLink>
              <Button
                variant="ghost"
                className={twJoin(
                  "p-1",
                  isPageWithHeroImage && "md:text-white"
                )}
                onClick={() => setIsMenuOpen(true)}
              >
                <Icon name="menu" className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </LayoutColumn>
      </Layout>
      <Drawer
        isOpened={isMenuOpen}
        onCloseClick={() => setIsMenuOpen(false)}
        onBackdropClick={() => setIsMenuOpen(false)}
      >
        <div className="flex flex-col text-white h-full">
          <div className="flex items-center pb-6 mb-8 pt-5 w-full border-b border-white px-8">
            <Button
              variant="ghost"
              className="text-white p-1"
              onClick={() => setIsMenuOpen(true)}
            >
              <Icon name="search" className="w-6 h-6" />
            </Button>
            <Input placeholder="Search" className="h-auto bg-black px-1" />
          </div>
          <div className="text-lg flex flex-col gap-8 font-medium px-8">
            <LocalizedClientLink
              href="/about"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/inspiration"
              onClick={() => setIsMenuOpen(false)}
            >
              Inspiration
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/store"
              onClick={() => setIsMenuOpen(false)}
            >
              Shop
            </LocalizedClientLink>
          </div>
          <Select
            selectedKey={`${countryCode}`}
            onSelectionChange={(key) => {
              updateRegion(`${key}`, currentPath)
            }}
            className="mt-auto ml-8 mb-8"
          >
            <UiSelectButton className="bg-transparent border-0 max-md:text-base gap-2 p-1 w-auto">
              <UiSelectValue>
                {(item) =>
                  typeof item.selectedItem === "object" &&
                  item.selectedItem !== null &&
                  "country" in item.selectedItem &&
                  typeof item.selectedItem.country === "string"
                    ? item.selectedItem.country.toUpperCase()
                    : item.defaultChildren
                }
              </UiSelectValue>
              <UiSelectIcon className="text-current w-6 h-6" />
            </UiSelectButton>
            <Popover className="max-w-61 w-full">
              <UiSelectListBox>
                {countryOptions.map((country) => (
                  <UiSelectListBoxItem
                    key={country.country}
                    id={country.country}
                    value={country}
                  >
                    {country.label}
                  </UiSelectListBoxItem>
                ))}
              </UiSelectListBox>
            </Popover>
          </Select>
        </div>
      </Drawer>
    </div>
  )
}

export default InnerHeader