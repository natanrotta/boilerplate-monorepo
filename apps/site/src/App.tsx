import { Flex } from "@chakra-ui/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PageBackdrop } from "@/components/PageBackdrop";
import { ROUTES } from "@/content/site";
import { LandingPage } from "@/pages/LandingPage";
import { PrivacyPolicy } from "@/pages/PrivacyPolicy";
import { TermsOfUse } from "@/pages/TermsOfUse";

export const App = () => (
  <BrowserRouter>
    {/* `clip`, not `hidden`: it trims the glow without becoming a scroll container, which would unstick the header. */}
    <Flex direction="column" position="relative" minH="100vh" overflow="clip" bg="bg.canvas">
      <PageBackdrop />
      <Header />
      <Flex as="main" direction="column" position="relative" flex={1}>
        <Routes>
          <Route path={ROUTES.home} element={<LandingPage />} />
          <Route path={ROUTES.privacy} element={<PrivacyPolicy />} />
          <Route path={ROUTES.terms} element={<TermsOfUse />} />
        </Routes>
      </Flex>
      <Footer />
    </Flex>
  </BrowserRouter>
);
