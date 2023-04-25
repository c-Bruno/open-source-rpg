import { Button } from "@mui/material";
import { withStyles } from "@mui/styles";
import React from "react";

import Image from "next/image";

import {
  Delete as DeleteIcon,
  Favorite as HeartIcon,
  FavoriteBorder as HeartIconNoLife,
  Link as LinkIcon,
  Chair as SanityIcon,
  ChairAltOutlined as SanityIconEmpty
} from "@mui/icons-material";

import useModal from "../hooks/useModal";

import GeneratePortraitModal from "./modals/GeneratePortraitModal.component";

const styles = (theme) => ({
  root: {
    background: theme.palette.primary[900],
    borderRadius: "5px",
    padding: "15px",
    width: "100%",
    display: "flex",
    alignItems: "center",
    minHeight: "121px",
    gap: "20px",
  },

  characterImage: {
    width: "75px",
    borderRadius: "50%",
  },

  characterName: {
    fontSize: "18px",
    fontWeight: "bold",
    marginTop: "8px",
  },

  hpInfo: {
    fontWeight: "bold",
  },

  mainInformations: {
    display: "flex",
    justifyContent: "center",
    alignItems: "start",
    flexDirection: "column",
    gap: "10px",
  },

  btn: {
    width: 40,
    height: 40,
    minWidth: 40,
    borderRadius: "5px",
  },
});

function CharacterBox({ classes, character, deleteCharacter, ...rest }) {
  const getCharacterPictureURL = () => {
    if (!character) {
      return null;
    }

    if (
      character.standard_character_picture_url &&
      character.injured_character_picture_url
    ) {
      if (character.current_hit_points > character.max_hit_points / 2) {
        return character.standard_character_picture_url;
      } else {
        return character.injured_character_picture_url;
      }
    } else {
      return `/assets/character.png`;
    }
  };

  const generatePortraitModal = useModal(({ close, custom }) => (
    <GeneratePortraitModal
      handleClose={close}
      characterId={custom.characterId}
    />
  ));

  return (
    <div className={classes.root} {...rest}>
      <Image
        src={getCharacterPictureURL()}
        alt="Character Portrait"
        className={classes.characterImage}
        width={70}
        height={70}
      />
      <div className={classes.mainInformations}>
        {/* Nome do personagem */}
        <span className={classes.characterName}>
          {character.name} (ID: {character.id})
        </span>

        <div>
          {/* Vida resumida */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#E80A67",
              gap: "3px",
              float: "left",
              marginRight: "10px",
            }}
          >
            {character.current_hit_points === 0 ? (
              <HeartIconNoLife />
            ) : (
              <HeartIcon />
            )}
            <span className={classes.hpInfo}>
              {character.current_hit_points}/{character.max_hit_points}
            </span>
          </div>

          {/* Sanidade Resumida resumida */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#1e45b6",
              gap: "3px",
            }}
          >
            {character.current_sanity_points === 0 ? (
              <SanityIconEmpty />
            ) : (
              <SanityIcon />
            )}
            <span className={classes.hpInfo}>
              {character.current_sanity_points}/{character.max_sanity_points}
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            marginTop: "10px",
          }}
        >
          {/* Adicionar novo personagem */}
          <div>
            <Button
              variant="outlined"
              href={`/sheet/${character.id}`}
              target="_blank"
              className={classes.btn}
            >
              <LinkIcon />
            </Button>
          </div>

          {/* Configuração OBS */}
          {/* <div>
            <Button
              variant="outlined"
              className={classes.btn}
              onClick={() => generatePortraitModal.appear({ characterId: character.id })}
            >
              <CameraIcon />
            </Button>
          </div> */}

          {/* Deletar personagem */}
          <div>
            <Button
              variant="outlined"
              onClick={() => deleteCharacter(character.id)}
              className={classes.btn}
            >
              <DeleteIcon />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withStyles(styles)(CharacterBox);