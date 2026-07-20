FROM quay.io/keycloak/keycloak:19.0.3
COPY dls-keycloak_v19.jar /opt/keycloak/providers/dls-keycloak.jar
COPY login_gov-15.0.2.jar /opt/keycloak/providers/login_gov-15.0.2.jar
COPY server.keystore /conf/server.keystore

EXPOSE 8443

ENTRYPOINT [ "/opt/keycloak/bin/kc.sh" ] 
