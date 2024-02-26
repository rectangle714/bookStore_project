FROM openjdk:17
ARG JAR_FILE=*.jar
COPY ${JAR_FILE} bootProject-0.0.1-SNAPSHOT.jar
ENTRYPOINT ["java","-jar","/bootProject-0.0.1-SNAPSHOT.jar"]
