module.exports =
`
type Weather {
	String city
	Float latitude
	Float longitude

	String last_updated
	Float temp_c
	Float temp_f
	String condition
	Float wind_mph
	Float wind_kph
	String wind_dir
}

scalar Index
scalar Date

type Book {
	Index index
	String title
	Date published
}

type Author {
	Index index
	String name
	Book books
}
`;
