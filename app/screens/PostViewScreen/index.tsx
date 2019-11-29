import { useQuery } from '@apollo/react-hooks';
import React, { useContext } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks';
import { IconSizes, PostDimensions, Routes } from '../../constants';
import { AppContext } from '../../context';
import { QUERY_POST } from '../../graphql/query';
import { GoBackHeader, NativeImage, PostViewScreenPlaceholder } from '../../layout';
import { Typography } from '../../theme';
import { ThemeColors } from '../../types';
import { parseTimeElapsed } from '../../utils/shared';

const { FontWeights, FontSizes } = Typography;

const CommentInput = () => {
  const { user, theme } = useContext(AppContext);

  return (
    <View style={styles().commentInput}>
      <NativeImage
        uri={user.avatar}
        style={styles(theme).commentAvatarImage}
      />
      <TextInput
        autoCorrect={false}
        style={styles(theme).commentTextInput}
        value={''}
        placeholder={`Add a comment as ${user.handle}...`}
        placeholderTextColor={theme.text02}
        onChangeText={text => null} />
    </View>
  );
};

const PostViewScreen = () => {

  const { theme } = useContext(AppContext);
  const { navigate } = useNavigation();
  const postId = useNavigationParam('postId');

  const { data: postData, loading: postLoading, error: postError } = useQuery(QUERY_POST, { variables: { postId } });

  const navigateToProfile = userId => navigate(Routes.ProfileViewScreen, { userId });

  let content = <PostViewScreenPlaceholder />;

  if (!postLoading && !postError) {
    const {
      post: {
        author: {
          id: userId,
          avatar,
          handle
        },
        uri,
        likes,
        caption,
        createdAt
      }
    } = postData;

    content = (
      <>
        <TouchableOpacity onPress={() => navigateToProfile(userId)} style={styles().postHeader}>
          <NativeImage
            uri={avatar}
            style={styles(theme).avatarImage}
          />
          <View>
            <Text style={styles(theme).handleText}>{handle}</Text>
            <Text style={styles(theme).timeText}>{parseTimeElapsed(createdAt)} ago</Text>
          </View>
        </TouchableOpacity>
        <NativeImage
          uri={uri}
          style={styles(theme).postImage}
        />
        <Text style={styles(theme).likesText}>{likes} likes</Text>
        <Text style={styles(theme).captionText}>{caption}</Text>
      </>
    );
  }

  return (
    <View style={styles(theme).container}>
      <GoBackHeader iconSize={IconSizes.x7} />
      <ScrollView style={styles().content}>
        {content}
      </ScrollView>
      <CommentInput />
    </View>
  );
};

const styles = (theme = {} as ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.base
  },
  content: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 20
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatarImage: {
    height: 50,
    width: 50,
    backgroundColor: theme.placeholder,
    borderRadius: 50,
    marginRight: 12
  },
  handleText: {
    ...FontWeights.Regular,
    ...FontSizes.Body,
    color: theme.text01
  },
  timeText: {
    ...FontWeights.Light,
    ...FontSizes.Caption,
    color: theme.text02,
    marginTop: 2
  },
  postImage: {
    ...PostDimensions.Large,
    marginTop: 25,
    borderRadius: 10,
    backgroundColor: theme.placeholder
  },
  likesText: {
    ...FontWeights.Regular,
    ...FontSizes.Body,
    marginTop: 20,
    color: theme.text01
  },
  captionText: {
    ...FontWeights.Light,
    ...FontSizes.Body,
    color: theme.text01,
    marginTop: 5,
    marginBottom: 20
  },
  commentInput: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    borderTopWidth: StyleSheet.hairlineWidth,
    backgroundColor: theme.base
  },
  commentAvatarImage: {
    height: 40,
    width: 40,
    backgroundColor: theme.placeholder,
    marginRight: 10,
    borderRadius: 50
  },
  commentTextInput: {
    flex: 1,
    ...FontWeights.Light,
    ...FontSizes.Body,
    paddingVertical: Platform.select({ ios: 8, android: 6 }),
    paddingHorizontal: 20,
    backgroundColor: theme.placeholder,
    color: theme.text01,
    borderRadius: 20,
    marginVertical: 5
  }
});

export default PostViewScreen;