// components/LanguageSwitcher.tsx
"use client";

import { useState } from "react";
import Cookie from "js-cookie";
import {
  Button,
  Card,
  CardBody,
  cn,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  RadioProps,
  Spinner,
  useDisclosure,
  useRadio,
  VisuallyHidden,
} from "@nextui-org/react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";

const LanguageSwitcher = () => {
  const [locale, setLocale] = useState<string>(
    Cookie.get("NEXT_LOCALE") || "en"
  );

  const t = useTranslations();

  const { setTheme, theme } = useTheme();
  const isDarkMode = typeof window !== "undefined" ? theme === "dark" : false;
  const [newLocale, setNewLocale] = useState<string>(locale);
  const [isLoading, setIsLoading] = useState(false);

  const {
    isOpen: isLanguageOpen,
    onOpen: onLanguageOpen,
    onOpenChange: onLanguageOpenChange,
  } = useDisclosure();

  const handleLocaleChange = (newLocale: string) => {
    // Set the cookie for the new locale
    Cookie.set("NEXT_LOCALE", newLocale, { expires: 365, path: "/" });

    // Update the state
    setLocale(newLocale);

    // Reload the page to apply the new locale
    window.location.reload();
  };

  return (
    <div className="px-3">
      <Card
        isBlurred
        isPressable
        // onPress={() => handleLocaleChange(locale === "en" ? "th" : "en")}
        onPress={onLanguageOpen}
        style={{
          pointerEvents: "all",
          backgroundColor: isDarkMode
            ? "hsla(0,0%,0%,.8)"
            : "hsla(0,0%,100%,.8)",
          padding: "0px",
        }}
      >
        <CardBody style={{ padding: "0px 12px" }}>
          {locale.toLocaleUpperCase()}
        </CardBody>
      </Card>

      <Modal
        isOpen={isLanguageOpen}
        onOpenChange={onLanguageOpenChange}
        backdrop="blur"
        size="2xl"
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        style={{ userSelect: "none" }}
        scrollBehavior="inside"
        hideCloseButton
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {isLoading ? t("applying") : t("languages")}
              </ModalHeader>
              <ModalBody style={{ position: "relative" }}>
                {isLoading ? (
                  <Spinner size="lg" />
                ) : (
                  <RadioGroup
                    label={t("select_language")}
                    orientation="horizontal"
                    defaultValue={locale}
                    onValueChange={setNewLocale}
                  >
                    <Radio style={{ paddingRight: "20px" }} value="en">
                      English
                    </Radio>
                    <Radio style={{ paddingRight: "20px" }} value="th">
                      ไทย
                    </Radio>
                  </RadioGroup>
                )}
              </ModalBody>
              <ModalFooter>
                {isLoading ? null : (
                  <div className="flex">
                    <div className="button-container">
                      <Button
                        color="danger"
                        variant="light"
                        onPress={() => {
                          setNewLocale(locale);
                          onClose();
                        }}
                      >
                        {locale == newLocale ? t("close") : t("cancel")}
                      </Button>
                    </div>
                    <div>
                      <Button
                        onPress={() => {
                          setIsLoading(true);
                          handleLocaleChange(newLocale);
                        }}
                        style={{
                          paddingRight: "20px",
                          pointerEvents: locale == newLocale ? "none" : "all",
                        }}
                        variant="shadow"
                        color={newLocale == locale ? "default" : "primary"}
                      >
                        {t("apply")}
                      </Button>
                    </div>
                  </div>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default LanguageSwitcher;
