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

scalar Date

type Book {
	String title
	Date published
}

type Author {
	String name
	Book books
}
`;
