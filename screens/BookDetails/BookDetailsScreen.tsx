import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Book, BookDetails, RootStackParamList } from "../../types";
import ReadMoreText from "../../components/common/ReadMoreText";
import { COLORS, FONTSIZE, SPACING, STATUSBAR_HEIGHT } from "../../utils/theme";
import { BOOK_ASPECT_RATIO } from "../../utils/constants";
import { useBookDetails } from "../../hooks/useBooks";
import { useAllAuthorDetails } from "../../hooks/useAuthor";
import { useBookStore } from "../../store/bookStore";
import { getAuthorNames } from "../../utils/helpers";

function getDescriptionText(
  description?: string | { value: string }
): string | undefined {
  if (!description) return undefined;
  return typeof description === "string" ? description : description.value;
}

const getCoverUrl = (cover_i?: number) =>
  cover_i
    ? `https://covers.openlibrary.org/b/id/${cover_i}-M.jpg`
    : "https://placehold.co/600x400?text=Hello+World";

const BookDetailsScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, "BookDetails">>();
  const navigation = useNavigation();
  const { key,first_publish_year } = route.params;
  const workid = String(key.split("/").at(-1));

  const { data: book, isLoading, error } = useBookDetails(workid);
  const {
    data: authors,
    error: authorError,
    isLoading: authorLoading,
  } = useAllAuthorDetails(book?.authors);

// store
const {toggleFavorite,isFavorite} = useBookStore()


const handleToggleFavorite = ({
  book,
  first_publish_year,
  author_name,
  cover_i,
}: {
  book: BookDetails;
  first_publish_year: number;
  author_name?:string[];
  cover_i:number;
}) => {
  toggleFavorite({
    ...book,
    first_publish_year, // Add this if it's part of your Book type, or omit if not needed
    author_name,
    cover_i,
  });
};

  if (isLoading || authorLoading) return <View style={{flex:1,alignItems:'center',justifyContent:'center',}}>
    <ActivityIndicator size={"large"} color={COLORS.accent2}/>
    </View>;
  if (error || authorError) {
    console.error("Query error:", error);
    return <Text>Error loading book details</Text>;
  }
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.main}>
          <View style={styles.image}>
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.icon}
              >
                <Ionicons name="arrow-back" size={16} color="white" />
              </TouchableOpacity>
              {book && (
  <TouchableOpacity
    onPress={() => handleToggleFavorite({ book, first_publish_year,cover_i:book?.covers?.[0]!,author_name:getAuthorNames(authors) })}
    style={styles.icon}
  >
    <Ionicons
      name={isFavorite(book.key) ? "heart" : "heart-outline"}
      size={16}
      color={"white"}
    />
  </TouchableOpacity>
)}


            </View>
            <Image
              source={{ uri: getCoverUrl(book?.covers?.[0]) }}
              style={StyleSheet.absoluteFill}
            />
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.title}>{book?.title}</Text>

            {/* Author Row */}
            {authors && authors.length > 0 && (
              <View style={styles.pillRow}>
                <Ionicons
                  name="pencil-sharp"
                  size={16}
                  color={COLORS.accent2}
                  style={{ marginRight: SPACING.xs }}
                />
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.pillsContainer}
                >
                  {authors?.map((author) => (
                    <View key={author.key} style={styles.pill}>
                      <Text style={styles.pillText}>{author.name}</Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Subject row */}
            {book?.subjects && book?.subjects?.length > 0 && (
              <View style={styles.pillRow}>
                <Ionicons
                  name="albums"
                  size={16}
                  color={COLORS.accent2}
                  style={{ marginRight: SPACING.xs }}
                />
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.pillsContainer}
                >
                  {book?.subjects?.map((subject, index) => (
                    <View key={index} style={styles.pill}>
                      <Text style={styles.pillText}>{subject}</Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Publisher row */}
            {book?.publisher && book?.publisher?.length > 0 && (
              <View style={styles.pillRow}>
                <Ionicons
                  name="print"
                  size={16}
                  color={COLORS.accent2}
                  style={{ marginRight: SPACING.xs }}
                />
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.pillsContainer}
                >
                  {book?.publisher?.map((pub, index) => (
                    <View key={index} style={styles.pill}>
                      <Text style={styles.pillText}>{pub}</Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* <Text style={styles.author}>{book?.key}</Text> */}
            {book?.description && (
            <ReadMoreText
              style={styles.description}
              readMoreStyle={{ fontWeight: "600", marginTop: 2 }}
              numberOfLines={3}
            >
              {getDescriptionText(book?.description)}
            </ReadMoreText>
            )}

            <View style={styles.additionalDetails}>
              {first_publish_year && (
                <View style={styles.detailRow}>
                  <Ionicons
                    name="calendar"
                    size={16}
                    color={COLORS.accent2}
                    style={styles.detailIcon}
                  />
                  <Text style={styles.detailText}>
                    Published: {first_publish_year}
                  </Text>
                </View>
              )}

              {book?.key && (
                <View style={styles.detailRow}>
                  <Ionicons
                    name="key"
                    size={16}
                    color={COLORS.accent2}
                    style={styles.detailIcon}
                  />
                  <Text style={styles.detailText}>Key: {book.key}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity
        style={{
          ...styles.button,
          marginBottom: SPACING.lg,
          marginHorizontal: SPACING.lg,
        }}
      >
        <Text style={styles.buttonText}>Want to Read</Text>
      </TouchableOpacity>
    </View>
  );
};

export { BookDetailsScreen };

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.light1,
    flex: 1,
    paddingTop: STATUSBAR_HEIGHT,
  },
  main: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    gap: SPACING.lg,
    padding: SPACING.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    top: 0,
    left: 0,
    right: 0,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: "rgba(0,0,0,0.1)",
    position: "absolute",
    zIndex: 1,
  },
  headerText: {
    fontSize: FONTSIZE.subheading,
    fontWeight: "condensedBold",
    color: COLORS.light2,
  },
  icon: {
    backgroundColor: COLORS.accent2,
    borderRadius: 8,
    padding: SPACING.sm,
    elevation: 5,
  },
  image: {
    width: "100%",
    aspectRatio: BOOK_ASPECT_RATIO,
    borderRadius: 16,
    overflow: "hidden",
  },
  tagsContainer: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  tag: {
    backgroundColor: COLORS.light2,
    borderRadius: 16,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
  },
  tagText: {
    fontSize: FONTSIZE.body,
    color: COLORS.dark2,
  },
  detailsContainer: {
    flex: 1,
    gap: SPACING.sm,
  },
  ratingPriceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingContainer: {
    flexDirection: "row",
  },
  price: {
    fontSize: FONTSIZE.title,
    fontWeight: "bold",
    color: COLORS.dark2,
  },
  title: {
    fontSize: FONTSIZE.heading,
    fontWeight: "bold",
    color: COLORS.dark2,
  },
  author: {
    fontSize: FONTSIZE.body,
    color: COLORS.dark1,
  },
  description: {
    fontSize: FONTSIZE.body,
    color: COLORS.dark1,
    fontStyle: "italic",
  },
  button: {
    backgroundColor: COLORS.accent2,
    borderRadius: 8,
    paddingVertical: SPACING.md,
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.light1,
    fontSize: FONTSIZE.subheading,
    fontWeight: "bold",
  },
  pillRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  pill: {
    backgroundColor: COLORS.light2,
    borderRadius: 16,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    marginRight: SPACING.xs,
  },
  pillText: {
    fontSize: FONTSIZE.body,
    color: COLORS.accent2,
    fontWeight: "bold",
  },
  pillsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  additionalDetails: {
    gap: SPACING.sm,
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  detailIcon: {
    marginRight: SPACING.sm,
  },

  detailText: {
    fontSize: FONTSIZE.body,
    color: COLORS.dark2,
  },
});
