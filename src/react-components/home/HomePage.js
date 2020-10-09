import React, { useContext, useEffect } from "react";
import { FormattedMessage, addLocaleData } from "react-intl";
import en from "react-intl/locale-data/en";
import classNames from "classnames";
import configs from "../../utils/configs";
import IfFeature from "../if-feature";
import { Page } from "../layout/Page";
import { useFavoriteRooms } from "./useFavoriteRooms";
import { usePublicRooms } from "./usePublicRooms";
import styles from "./HomePage.scss";
import discordLogoUrl from "../../assets/images/discord-logo-small.png";
import { AuthContext } from "../auth/AuthContext";
import { createAndRedirectToNewHub } from "../../utils/phoenix-utils";
import { MediaGrid } from "./MediaGrid";
import { RoomTile } from "./RoomTile";
import styled from 'styled-components';


const HomepageBanner = styled.div`
  padding: 20vh 0;

  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;

const BannerTextWrapper = styled.div`
  width: 40%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;

  & >  div {
    margin-bottom: 2rem;
  }
`;

const BannerHeader = styled.div`
  color: #3A3A3A;

  font: Roboto;
  font-size: 4rem;
  font-weight: 700;
  line-height: 85%;

  padding-bottom: 1rem;
`;

const BannerSubheader = styled.div`
  color: #555;
  font: Roboto;
  font-size: 1.5rem;
`;

const BannerImage = styled.img`
  background-size: contain;
  background-repeat: no-repeat;

  width: 50%;

  border-radius: 2px;
  border: 2px solid #9437FF;
`;

const LandingButton = styled.a`
  border-radius: 35px;
  background-color: #9437FF;

  color: white;
  font: Roboto;
  font-size: 1.15rem;

  padding: 1rem 2rem;
  box-shadow: 0px 3px 3px rgba(148, 55, 255, 0.4);

  user-select: none;
  cursor: pointer;

  transition: all 0.25s ease;
  text-decoration: none;

  &::hover {
    box-shadow: 0px 3px 3px rgba(148, 55, 255, 0.7);
  }
`;

const MediaGroupContainer = styled.div`
  padding: 2rem;

  background-color: rgb(148,55,255);
  box-shadow: 0px 3px 3px rgba(0.1, 0.1, 0.1, 0.2);
  border-radius: 15px;
`;

const RoomHeader = styled.div`
  color: white;
  font: Roboto;
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;

  margin-bottom: 2rem;
`;


addLocaleData([...en]);

export function HomePage() {
  const auth = useContext(AuthContext);

  const { results: favoriteRooms } = useFavoriteRooms();
  const { results: publicRooms } = usePublicRooms();

  const featuredRooms = Array.from(new Set([...favoriteRooms, ...publicRooms])).sort(
    (a, b) => b.member_count - a.member_count
  );

  useEffect(() => {
    const qs = new URLSearchParams(location.search);

    // Support legacy sign in urls.
    if (qs.has("sign_in")) {
      const redirectUrl = new URL("/signin", window.location);
      redirectUrl.search = location.search;
      window.location = redirectUrl;
    } else if (qs.has("auth_topic")) {
      const redirectUrl = new URL("/verify", window.location);
      redirectUrl.search = location.search;
      window.location = redirectUrl;
    }

    if (qs.has("new")) {
      createAndRedirectToNewHub(null, null, true);
    }
  }, []);


  const landingPage = configs.image("landing_page");

  return (
    <Page className={styles.homePage}>

      <HomepageBanner>
        <BannerTextWrapper>
          <BannerHeader>
            Video Chat Doesn’t Have to be Awkward
          </BannerHeader>
          <BannerSubheader>
            SocialHubs is a 3D video chat platform for hanging out with your friends in these distant times. Schools and companies can keep their community strong with themed rooms, fun games, and icebreakers!
          </BannerSubheader>
          <LandingButton href="mailto:steffenholm@gmail.com"> Request a Demo ⭢  </LandingButton>
        </BannerTextWrapper>

        <BannerImage src={landingPage}/>
      </HomepageBanner>


      {featuredRooms.length > 0 && (
        <section className={styles.featuredRooms}>
          <MediaGroupContainer>
            <RoomHeader> Click a Room to Explore!</RoomHeader>
            <MediaGrid>
              { featuredRooms.map(room => <RoomTile key={room.id} room={room} />) }
            </MediaGrid>
          </MediaGroupContainer>
        </section>
      )}

      <section>
        <div className={styles.secondaryLinks}>
          <div>
            <IfFeature name="show_discord_bot_link">
              <FormattedMessage id="home.add_to_discord_1" />
              <img src={discordLogoUrl} />
              <a href="/discord">
                <FormattedMessage id="home.add_to_discord_2" />
              </a>
              <FormattedMessage id="home.add_to_discord_3" />
            </IfFeature>
          </div>
        </div>
      </section>
    </Page>
  );
}
